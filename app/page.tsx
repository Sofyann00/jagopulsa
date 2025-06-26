"use client"
import { Button } from "@/components/ui/button"
import { ChevronRight, Gamepad2, Gift, CreditCard, ArrowRight, Smartphone, Monitor, Globe, Users, LucideProps, CheckCircle2, Zap, Shield, Sparkles, Search, ShoppingCart, User, LogOut } from "lucide-react"
import Link from "next/link"
import { products, formatPrice } from "@/lib/data"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { useRef, useState } from "react"
import { useUser } from "@/contexts/user-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { RedeemCode } from "@/components/redeem-code"

export default function Home() {
  const { user, logout } = useUser()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [openQna, setOpenQna] = useState<number | null>(null);
  const [points, setPoints] = useState(0)

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSearchResults(query.length > 0)
  }

  const servicesRef = useRef<HTMLDivElement>(null)
  
  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const categories = [
    { name: "Pulsa & Kredit", icon: (props: LucideProps) => <Smartphone {...props} /> },
    { name: "Token Listrik", icon: (props: LucideProps) => <Zap {...props} /> },
    { name: "Paket Data", icon: (props: LucideProps) => <Globe {...props} /> },
    { name: "E-Wallet", icon: (props: LucideProps) => <CreditCard {...props} /> },
  ]

  const marketplaceFeatures = [
    {
      name: 'Isi Pulsa & Paket Data',
      description: 'Isi pulsa dan beli paket data untuk semua operator dengan harga terjangkau.',  
      icon: <Smartphone className="h-8 w-8 text-blue-400" />,
    },
    {
      name: 'Token Listrik PLN',
      description: 'Bayar listrik PLN dengan mudah, proses instan langsung masuk meteran.',
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
    },
    {
      name: 'Pengiriman Instan',
      description: 'Terima token dan voucher dalam hitungan detik setelah pembayaran.',
      icon: <CheckCircle2 className="h-8 w-8 text-green-400" />,
    },
    {
      name: 'Pembayaran Aman',
      description: 'Berbelanja dengan tenang menggunakan sistem pembayaran yang aman dan terpercaya.',
      icon: <Shield className="h-8 w-8 text-blue-400" />,
    },
    {
      name: 'Layanan 24/7',
      description: 'Tim support kami siap membantu Anda kapan saja, di mana saja.',
      icon: <Users className="h-8 w-8 text-pink-400" />,
    },
    {
      name: 'Promo & Diskon',
      description: 'Nikmati promo reguler dan diskon eksklusif untuk member setia.',
      icon: <Sparkles className="h-8 w-8 text-orange-400" />,
    },
  ];

  const qnaList = [
    {
      question: "Apakah Pulsa dan Token Listrik dari jagopulsa.net Legal?",
      answer: (
        <span>
          Semua pulsa, token listrik, dan voucher digital yang dijual di jagopulsa.net <b>100% legal dan bersumber dari provider resmi</b>. Jangan khawatir, berbelanja di jagopulsa.net dijamin aman.
        </span>
      ),
    },
    {
      question: "Bagaimana Cara Isi Pulsa atau Beli Token Listrik?", 
      answer: (
        <span>
          Cukup pilih layanan yang diinginkan (pulsa/token listrik), masukkan nomor telepon atau nomor meteran, pilih nominal, dan selesaikan pembayaran. Pesanan Anda akan diproses secara instan!
        </span>
      ),
    },
    {
      question: "Apakah Bisa Bayar Menggunakan QRIS?",
      answer: (
        <span>
          Ya, jagopulsa.net mendukung berbagai metode pembayaran termasuk QRIS, Virtual Account, dan e-wallet.
        </span>
      ),
    },
    {
      question: "Pembayaran Berhasil, Tapi Pulsa/Token Belum Masuk?",
      answer: (
        <span>
          Silakan hubungi layanan pelanggan kami dengan detail pesanan Anda. Kami akan membantu menyelesaikan masalah Anda secepatnya.
        </span>
      ),
    },
    {
      question: "Mengapa Harus Beli di jagopulsa.net?",
      answer: (
        <span>
          Kami menawarkan pengiriman instan, pembayaran aman, dan hanya produk resmi dari provider terpercaya. Kepuasan dan keamanan Anda adalah prioritas kami!
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col bg-white text-gray-900">
      {/* Hero Section - Static PPOB Design */}
      <section className="relative mb-12 sm:mb-16 mt-16 sm:mt-24 overflow-hidden">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative h-[400px] sm:h-[480px] md:h-[520px] lg:h-[600px] rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="JagoPulsa Background" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f77a0e]/90 via-[#f77a0e]/70 to-[#f77a0e]/50" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center h-full p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="max-w-3xl">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-6">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Platform PPOB Terpercaya #1 di Indonesia
                </div>
                
                {/* Main Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                  Isi Pulsa & Token Listrik
                  <br />
                  <span className="text-white/90">Semua Operator</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg sm:text-xl md:text-2xl text-white/95 font-medium leading-relaxed mb-8 max-w-2xl">
                  Telkomsel, XL, Indosat, THREE, Axis, Smartfren & by.U - Proses Instan, Harga Terjangkau, Pembayaran Mudah & Aman
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    onClick={scrollToServices}
                    className="bg-white text-[#f77a0e] hover:bg-white/90 font-semibold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Isi Pulsa Sekarang
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">8+</div>
                    <div className="text-sm sm:text-base text-white/80">Operator</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">24/7</div>
                    <div className="text-sm sm:text-base text-white/80">Layanan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">Instan</div>
                    <div className="text-sm sm:text-base text-white/80">Proses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold">100%</div>
                    <div className="text-sm sm:text-base text-white/80">Aman</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section ref={servicesRef} className="py-12 sm:py-16 md:py-24 2xl:py-32 mt-20 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="w-full mx-auto max-w-[1920px] px-4 sm:px-6 2xl:px-8">
          <div className="text-center mb-8 sm:mb-16 2xl:mb-24">
            <span className="inline-block px-3 sm:px-4 2xl:px-6 py-1 sm:py-1.5 2xl:py-2 bg-[#f77a0e]/10 text-[#f77a0e] rounded-full text-xs sm:text-sm 2xl:text-lg font-medium mb-1 sm:mb-1 2xl:mb-2 border border-[#f77a0e]/20">
              Layanan PPOB
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl font-bold mb-3 sm:mb-4 2xl:mb-6">
              <span className="bg-gradient-to-r text-[#f77a0e] bg-clip-text text-transparent">Pulsa, Token Listrik & E-Wallet</span>
            </h2>
            <p className="text-base sm:text-lg 2xl:text-2xl text-gray-600 max-w-2xl 2xl:max-w-4xl mx-auto px-4">
              Lengkapi kebutuhan pulsa, token listrik, dan top up e-wallet dengan mudah dan cepat
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 2xl:gap-12">
            {products.map((product) => {
              const isHighlighted = product.name.toLowerCase().includes('pulsa telkomsel') || 
                    product.name.toLowerCase().includes('pulsa xl') ||
                    product.name.toLowerCase().includes('pulsa indosat') ||
                    product.name.toLowerCase().includes('pulsa three');

              return (
                <div key={product.id} className={`relative ${!isHighlighted && 'cursor-not-allowed'}`}>
                  {!isHighlighted && (
                    <div className="absolute inset-0 bg-black/50 z-10 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm sm:text-base 2xl:text-lg px-4 py-2 bg-black/50 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  <Link href={isHighlighted ? `/products/${product.id}` : '#'} className={!isHighlighted ? 'pointer-events-none' : ''}>
                    <Card className={`group cursor-pointer bg-white border-gray-100 ${!isHighlighted && 'opacity-50'}`}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 2xl:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium text-xs sm:text-sm 2xl:text-lg">
                              {formatPrice(product.price)}
                            </span>
                            <Button className="bg-[#f77a0e] hover:bg-[#f77a0e]/90 text-white text-xs sm:text-sm 2xl:text-base px-3 sm:px-4 2xl:px-6 py-1.5 sm:py-2 2xl:py-3 rounded-full transition-all duration-300">
                              Lihat Detail
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3 sm:p-4 2xl:p-6">
                        <h3 className="font-semibold text-base sm:text-lg 2xl:text-2xl mb-1 line-clamp-1 group-hover:text-[#f77a0e] transition-colors duration-200">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm 2xl:text-lg text-gray-500 line-clamp-2">
                          {product.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QnA Section */}
      <section className="py-12 sm:py-16 md:py-24 2xl:py-32 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-4xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="text-center mb-8 sm:mb-16 2xl:mb-24">
            <span className="inline-block px-3 sm:px-4 2xl:px-6 py-1 sm:py-1.5 2xl:py-2 bg-[#f77a0e]/10 text-[#f77a0e] rounded-full text-xs sm:text-sm 2xl:text-lg font-medium mb-3 sm:mb-4 2xl:mb-6 border border-[#f77a0e]/20">
              Pertanyaan Umum
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl font-bold mb-3 sm:mb-4 2xl:mb-6">
              <span className="bg-gradient-to-r text-[#f77a0e] bg-clip-text text-transparent">Frequently Asked Questions</span>
            </h2>
            <p className="text-base sm:text-lg 2xl:text-2xl text-gray-600 max-w-2xl 2xl:max-w-4xl mx-auto px-4">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan kami
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 2xl:space-y-6">
            {qnaList.map((qna, idx) => (
              <div 
                key={qna.question} 
                className="group relative"
              >
                <button
                  className={`w-full flex items-center justify-between p-4 sm:p-6 2xl:p-8 text-base sm:text-lg md:text-xl 2xl:text-2xl font-semibold rounded-xl sm:rounded-2xl 2xl:rounded-3xl transition-all duration-300 ${
                    openQna === idx 
                      ? "bg-white shadow-lg border border-[#f77a0e]/20" 
                      : "bg-white/50 hover:bg-white/80 border border-gray-100"
                  }`}
                  onClick={() => setOpenQna(openQna === idx ? null : idx)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-6">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openQna === idx 
                        ? "bg-[#f77a0e] text-white" 
                        : "bg-[#f77a0e]/10 text-[#f77a0e]"
                    }`}>
                      <span className="text-sm sm:text-lg 2xl:text-2xl font-bold">{idx + 1}</span>
                    </div>
                    <span className="text-left font-[600] text-gray-800 group-hover:text-[#f77a0e] transition-colors duration-200 text-sm sm:text-base md:text-lg 2xl:text-xl">
                      {qna.question}
                    </span>
                  </div>
                  <ChevronRight 
                    className={`ml-2 h-5 w-5 sm:h-6 sm:w-6 2xl:h-8 2xl:w-8 transition-all duration-300 ${
                      openQna === idx 
                        ? "rotate-90 text-[#f77a0e]" 
                        : "text-gray-400 group-hover:text-[#f77a0e]"
                    }`} 
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openQna === idx ? "max-h-[500px] 2xl:max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 sm:p-6 2xl:p-8 pt-3 sm:pt-4 2xl:pt-6 bg-white/50 rounded-b-xl sm:rounded-b-2xl 2xl:rounded-b-3xl border-x border-b border-gray-100">
                    <div className="flex items-start gap-3 sm:gap-4 2xl:gap-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 2xl:w-12 2xl:h-12 rounded-full bg-[#f77a0e]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7 text-[#f77a0e]" />
                      </div>
                      <div className="text-sm sm:text-base 2xl:text-xl text-gray-600 leading-relaxed">
                        {qna.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 2xl:mt-16 text-center">
            <p className="text-sm sm:text-base 2xl:text-xl text-gray-500 mb-3 sm:mb-4 2xl:mb-6">Masih punya pertanyaan?</p>
            <a
              href="https://wa.me/6285811959392"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 2xl:px-8 py-2.5 sm:py-3 2xl:py-4 bg-white text-[#f77a0e] rounded-full text-sm sm:text-base 2xl:text-xl font-medium hover:bg-[#f77a0e]/90 transition-all duration-300 shadow-lg shadow-[#f77a0e]/20 hover:shadow-xl hover:shadow-[#f77a0e]/30 hover:-translate-y-0.5"
            >
              <img src="/wa_img.png" alt="WhatsApp" className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-8 2xl:h-8" />
              Chat dengan Kami
            </a>
          </div>
        </div>
      </section>

      {/* Sell Voucher Section */}
      {/* <section className="py-12 sm:py-16 md:py-24 2xl:py-32 relative">
        <div className="max-w-4xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="text-center mb-4 sm:mb-8 2xl:mb-12">
            <span className="inline-block px-3 sm:px-4 2xl:px-6 py-1 sm:py-1.5 2xl:py-2 bg-[#f77a0e]/10 text-[#f77a0e] rounded-full text-xs sm:text-sm 2xl:text-lg font-medium mb-3 sm:mb-4 2xl:mb-6 border border-[#f77a0e]/20">
              Jual Voucher Digital
            </span>
            <p className="text-base sm:text-lg 2xl:text-2xl text-gray-600 max-w-2xl 2xl:max-w-4xl mx-auto px-4">
              Tukar voucher digital yang tidak terpakai menjadi uang tunai. Proses cepat, aman, dan terpercaya.
            </p>
          </div>

          <div className="flex justify-center">
            {user ? (
              <Link href="/sell-voucher">
                <Button 
                  className="bg-[#f77a0e] hover:bg-[#f77a0e]/90 text-white text-sm sm:text-base 2xl:text-xl px-6 sm:px-8 2xl:px-10 py-3 sm:py-4 2xl:py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#f77a0e]/30 hover:-translate-y-0.5"
                >
                  Jual Sekarang
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button 
                  className="bg-[#f77a0e] hover:bg-[#f77a0e]/90 text-white text-sm sm:text-base 2xl:text-xl px-6 sm:px-8 2xl:px-10 py-3 sm:py-4 2xl:py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#f77a0e]/30 hover:-translate-y-0.5"
                >
                  Login untuk Jual Voucher
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section> */}
    </div>
  )
}

const features = [
  {
    name: 'Instant Delivery',
    description: 'Get your game vouchers and credits instantly after purchase.',
    icon: <Zap className="h-6 w-6 text-blue-400" />,
    benefits: [
      'Digital delivery within minutes',
      'No waiting time',
      '24/7 availability'
    ]
  },
  {
    name: 'Secure Payments',
    description: 'Shop with confidence using our secure payment system.',
    icon: <Shield className="h-6 w-6 text-blue-400" />,
    benefits: [
      'Multiple payment methods',
      'SSL encryption',
      'Secure checkout process'
    ]
  },
  {
    name: 'Wide Selection',
    description: 'Access to all major gaming platforms and titles.',
    icon: <Gamepad2 className="h-6 w-6 text-blue-400" />,
    benefits: [
      'All major gaming platforms',
      'Popular game titles',
      'Regular new additions'
    ]
  },
]