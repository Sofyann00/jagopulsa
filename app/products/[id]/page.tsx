"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { products, formatPrice } from "@/lib/data"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/user-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useQRCode } from "next-qrcode"
import { Product, Item } from "@/lib/types"

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { user, addOrder } = useUser()
  const { Canvas } = useQRCode()
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [isLoadingPayment, setIsLoadingPayment] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const product: Product | undefined = products.find((p: Product) => p.id === parseInt(params.id))

  if (!product) {
    notFound()
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to continue with your purchase.",
        variant: "destructive"
      })
      return
    }

    if (!selectedItem || !phoneNumber || !selectedPayment) {
      toast({
        title: "Missing information",
        description: "Please select a package, enter your phone number, and choose a payment method.",
        variant: "destructive"
      })
      return
    }

    // Validate phone number format
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Indonesian phone number (e.g., 08123456789)",
        variant: "destructive"
      })
      return
    }

    setIsLoadingPayment(true)
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outputCurrency: "IDR",
          reference: `order-${Date.now()}`,
          inputCurrency: "IDR",
          balanceType: "fiat",
          paymentMethod: selectedPayment,
          inputAmount: selectedItem.price
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment');
      }

      console.log(data.data)

      setPaymentData(data.data);
      setShowPaymentDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPayment(false)
    }
  }

  const handlePaymentComplete = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Please log in to complete your purchase.",
        variant: "destructive"
      })
      return
    }

    setIsSendingEmail(true)
    
    try {
      // Add to cart
      addItem({
        ...product,
        price: selectedItem.price,
        quantity: 1
      })

      // Add order to user's orders
      addOrder({
        items: [{
          id: selectedItem.id.toString(),
          name: selectedItem.name,
          price: selectedItem.price,
          quantity: 1,
          image: selectedItem.iconUrl || product.image
        }],
        total: selectedItem.price,
        status: "completed",
        productName: product.name,
        itemName: selectedItem.name
      })

      // Send confirmation email via API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: user.email,
          productName: product.name,
          itemName: selectedItem.name,
          price: selectedItem.price,
          phoneNumber: phoneNumber
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast({
          title: "Email Error",
          description: "Failed to send confirmation email, but your purchase was successful.",
          variant: "destructive"
        })
      }
      
      setShowPaymentDialog(false)
      toast({
        title: "Thank You For Purchasing",
        description: `Your ${selectedItem.name} for ${phoneNumber} is being processed. We'll notify you via email once completed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your purchase. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Product Header with Banner */}
      <div className="relative h-[400px] overflow-hidden">
        {/* Background with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f77a0e]/90 via-[#f77a0e]/70 to-[#f77a0e]/50">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30" />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Product Logo */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{product.name}</h1>
                <p className="text-white/90 text-lg mb-6">{product.description}</p>
                
                {/* Badges */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Proses Instan
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    24/7 Customer Service
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Harga Terjangkau
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#f77a0e]">
                  <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 012.25 0v10.937a4.505 4.505 0 00-3.25 2.373 8.963 8.963 0 014-.935A.75.75 0 0018 15v-2.266a3.368 3.368 0 01.988-2.37 1.125 1.125 0 011.837 1.262 1.118 1.118 0 00-.329.79v3.006h-.005a6 6 0 01-1.752 4.007l-1.736 1.736a6 6 0 01-4.242 1.757H10.5a7.5 7.5 0 01-7.5-7.5V6.375a1.125 1.125 0 012.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 012.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875z" />
                </svg>
                Pilih Nominal {product.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.items?.map((item: Item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      console.log('Selected Item:', item);
                      setSelectedItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        priceDiscount: item.priceDiscount,
                        iconUrl: item.iconUrl
                      })
                    }}
                    className={cn(
                      "flex flex-col p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                      selectedItem?.id === item.id
                        ? "border-[#f77a0e] bg-[#f77a0e]/5 shadow-lg"
                        : "border-gray-200 hover:border-[#f77a0e]/50 hover:bg-[#f77a0e]/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f77a0e]/10 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#f77a0e]">
                            <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 012.25 0v10.937a4.505 4.505 0 00-3.25 2.373 8.963 8.963 0 014-.935A.75.75 0 0018 15v-2.266a3.368 3.368 0 01.988-2.37 1.125 1.125 0 011.837 1.262 1.118 1.118 0 00-.329.79v3.006h-.005a6 6 0 01-1.752 4.007l-1.736 1.736a6 6 0 01-4.242 1.757H10.5a7.5 7.5 0 01-7.5-7.5V6.375a1.125 1.125 0 012.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 012.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Nominal pulsa</p>
                        </div>
                      </div>
                      {selectedItem?.id === item.id && (
                        <div className="w-6 h-6 bg-[#f77a0e] rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-start">
                        <p className="text-lg font-bold text-[#f77a0e]">
                          {formatPrice(item.price)}
                        </p>
                                                 {item.priceDiscount && item.priceDiscount > 0 && (
                           <p className="text-sm text-gray-400 line-through">
                             {formatPrice(item.priceDiscount)}
                           </p>
                         )}
                       </div>
                       {item.priceDiscount && item.priceDiscount > 0 && (
                         <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                           Hemat {formatPrice(item.priceDiscount - item.price)}
                         </div>
                       )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#f77a0e]">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.653.349 2.121.91l1.131 1.362a1.25 1.25 0 001.18.569h10.192a3 3 0 013 3v6.75a3 3 0 01-3 3H4.5a3 3 0 01-3-3V4.5zm3-1.5a1.5 1.5 0 00-1.5 1.5v.5h18v-.5a1.5 1.5 0 00-1.5-1.5H4.5z" clipRule="evenodd" />
                </svg>
                Informasi Pesanan
              </h2>

              <div className="space-y-6">
                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <Input
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f77a0e] focus:ring-2 focus:ring-[#f77a0e]/20 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Masukkan nomor telepon yang akan diisi pulsa
                  </p>
                </div>

                {/* Selected Item Display */}
                {selectedItem && (
                  <div className="p-4 bg-[#f77a0e]/5 rounded-xl border border-[#f77a0e]/20">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Item Dipilih:</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{selectedItem.name}</p>
                        <p className="text-sm text-gray-600">{product.name}</p>
                      </div>
                      <p className="text-lg font-bold text-[#f77a0e]">
                        {formatPrice(selectedItem.price)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Pilih Pembayaran</h3>
                  
                  {/* QRIS */}
                  <button
                    onClick={() => setSelectedPayment('qris')}
                    className={cn(
                      "w-full p-4 rounded-xl border mb-3 flex items-center justify-between transition-all duration-200",
                      selectedPayment === 'qris'
                        ? "border-[#f77a0e] bg-[#f77a0e]/5"
                        : "border-gray-200 hover:border-[#f77a0e]/50 hover:bg-[#f77a0e]/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src="/qris_img.png"
                        alt="QRIS"
                        width={60}
                        height={24}
                        className="object-contain"
                      />
                      <span className="text-gray-900">QRIS</span>
                    </div>
                    <span className="text-gray-500">
                      {formatPrice(selectedItem?.price ?? 0)}
                    </span>
                  </button>

                  {/* Virtual Account */}
                  <button
                    onClick={() => setSelectedPayment('va')}
                    className={cn(
                      "w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200",
                      selectedPayment === 'va'
                        ? "border-[#f77a0e] bg-[#f77a0e]/5"
                        : "border-gray-200 hover:border-[#f77a0e]/50 hover:bg-[#f77a0e]/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VA</span>
                      </div>
                      <span className="text-gray-900">Virtual Account</span>
                    </div>
                    <span className="text-gray-500">
                      {formatPrice(selectedItem?.price ?? 0)}
                    </span>
                  </button>
                </div>

                {/* Payment Instructions */}
                {selectedPayment && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Cara Pembayaran:</h4>
                    {selectedPayment === 'qris' ? (
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Scan QR Code yang muncul setelah konfirmasi</li>
                        <li>Pilih aplikasi e-wallet atau mobile banking</li>
                        <li>Masukkan nominal pembayaran</li>
                        <li>Konfirmasi pembayaran</li>
                        <li>Pulsa akan masuk otomatis setelah pembayaran berhasil</li>
                      </ol>
                    ) : (
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li>Nomor Virtual Account akan muncul setelah konfirmasi</li>
                        <li>Buka aplikasi mobile banking</li>
                        <li>Pilih menu Transfer ke Virtual Account</li>
                        <li>Masukkan nomor Virtual Account</li>
                        <li>Konfirmasi pembayaran</li>
                        <li>Pulsa akan masuk otomatis setelah pembayaran berhasil</li>
                      </ol>
                    )}
                  </div>
                )}

                <Button 
                  size="lg" 
                  className="w-full bg-[#f77a0e] hover:bg-[#f77a0e]/90 text-white rounded-xl shadow-lg shadow-[#f77a0e]/20 hover:shadow-xl hover:shadow-[#f77a0e]/30 transition-all duration-300 py-4"
                  onClick={handleAddToCart}
                  disabled={!selectedItem || !phoneNumber || !selectedPayment || isLoadingPayment}
                >
                  {isLoadingPayment ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 012.25 0v10.937a4.505 4.505 0 00-3.25 2.373 8.963 8.963 0 014-.935A.75.75 0 0018 15v-2.266a3.368 3.368 0 01.988-2.37 1.125 1.125 0 011.837 1.262 1.118 1.118 0 00-.329.79v3.006h-.005a6 6 0 01-1.752 4.007l-1.736 1.736a6 6 0 01-4.242 1.757H10.5a7.5 7.5 0 01-7.5-7.5V6.375a1.125 1.125 0 012.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 012.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875z" />
                      </svg>
                      Isi Pulsa Sekarang
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Konfirmasi Pembayaran</DialogTitle>
            <DialogDescription className="text-gray-500">
              Selesaikan pembayaran untuk isi pulsa
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center p-4 bg-[#f77a0e]/5 rounded-xl border border-[#f77a0e]/20">
              <p className="text-2xl font-bold text-[#f77a0e]">
                {formatPrice(selectedItem?.price ?? 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedItem?.name} untuk {phoneNumber}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {product.name}
              </p>
            </div>

            {selectedPayment === 'qris' && paymentData?.paymentFiat?.qrData ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-64 h-64">
                  <Canvas
                    text={paymentData.paymentFiat.qrData}
                    options={{
                      errorCorrectionLevel: 'M',
                      margin: 3,
                      scale: 4,
                      width: 256,
                      color: {
                        dark: '#000000FF',
                        light: '#FFFFFFFF',
                      },
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Scan QR code menggunakan aplikasi pembayaran favorit Anda
                </p>
                <div className="text-sm text-gray-500 text-center">
                  <p>Berlaku sampai: {new Date(paymentData.expiredAt).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ) : selectedPayment === 'va' && paymentData?.paymentFiat ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Nomor Virtual Account:</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">{paymentData.paymentFiat.accountNumber}</p>
                  <p className="text-sm text-gray-500 mt-1">Bank: {paymentData.paymentFiat.bankName}</p>
                </div>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>1. Buka aplikasi mobile banking Anda</li>
                  <li>2. Pilih menu Transfer ke Virtual Account</li>
                  <li>3. Masukkan nomor VA di atas</li>
                  <li>4. Konfirmasi dan selesaikan pembayaran</li>
                </ul>
                <div className="text-sm text-gray-500 text-center">
                  <p>Berlaku sampai: {new Date(paymentData.expiredAt).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ) : null}

            <div className="flex justify-center gap-3 mt-6">
              <Button
                onClick={handlePaymentComplete}
                disabled={isSendingEmail}
                className="bg-[#f77a0e] hover:bg-[#f77a0e]/90 text-white rounded-xl shadow-lg shadow-[#f77a0e]/20 hover:shadow-xl hover:shadow-[#f77a0e]/30 transition-all duration-300"
              >
                {isSendingEmail ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Saya sudah menyelesaikan pembayaran"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 