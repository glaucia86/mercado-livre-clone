import type { Metadata } from 'next'
import './globals.css'

// ============================================================================
// METADATA - SEO e configurações da aplicação
// ============================================================================

export const metadata: Metadata = {
  title: 'MercadoLibre Clone - Marketplace Online',
  description: 'Encontre milhares de produtos com os melhores preços. Smartphones, notebooks, games e muito mais com frete grátis.',
  keywords: 'marketplace, e-commerce, produtos, compras online, smartphones, notebooks, games',
  authors: [{ name: 'MercadoLibre Clone Team' }],
  creator: 'MercadoLibre Clone',
  publisher: 'MercadoLibre Clone',
  robots: 'index, follow',
  openGraph: {
    title: 'MercadoLibre Clone - Marketplace Online',
    description: 'Encontre milhares de produtos com os melhores preços',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'MercadoLibre Clone'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MercadoLibre Clone - Marketplace Online',
    description: 'Encontre milhares de produtos com os melhores preços'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

// ============================================================================
// ROOT LAYOUT COMPONENT
// ============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* Preconnect para melhor performance */}
        <link rel="preconnect" href="https://http2.mlstatic.com" />
        <link rel="dns-prefetch" href="https://http2.mlstatic.com" />
        
        {/* Manifest para PWA (opcional) */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color para mobile browsers */}
        <meta name="theme-color" content="#3483FA" />
        <meta name="msapplication-TileColor" content="#3483FA" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        {/* ================================================================
            SKIP TO CONTENT - Acessibilidade
            ================================================================ */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
        >
          Pular para o conteúdo principal
        </a>

        {/* ================================================================
            HEADER - Navegação principal
            ================================================================ */}
        <Header />

        {/* ================================================================
            MAIN CONTENT - Conteúdo principal
            ================================================================ */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* ================================================================
            FOOTER - Rodapé
            ================================================================ */}
        <Footer />

        {/* ================================================================
            LOADING INDICATOR - Para transições de página
            ================================================================ */}
        <div id="loading-indicator" className="hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-3">
              <div className="loading-spinner"></div>
              <span className="text-gray-700">Carregando...</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

// ============================================================================
// HEADER COMPONENT - Navegação e busca
// ============================================================================

function Header() {
  return (
    <header className="bg-yellow-400 shadow-sm sticky top-0 z-40">
      <div className="container-ml">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
                <span className="text-white font-bold text-sm">ML</span>
              </div>
              <span className="hidden sm:block font-bold text-gray-800 text-lg">
                MercadoLibre
              </span>
            </a>
          </div>

          {/* Barra de busca */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos, marcas e muito mais..."
                className="w-full px-4 py-2 pl-10 pr-12 rounded-lg border-0 shadow-sm focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all duration-200"
                aria-label="Buscar produtos"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Buscar"
              >
                <svg className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Categorias
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Ofertas
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Histórico
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Minha conta
            </a>
          </nav>

          {/* Menu mobile */}
          <button className="md:hidden p-2 rounded-md hover:bg-yellow-300 transition-colors duration-200">
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

// ============================================================================
// FOOTER COMPONENT - Rodapé com informações
// ============================================================================

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="container-ml py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Sobre</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Como funciona</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Carreiras</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Imprensa</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Frete e entrega</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Devoluções</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Contato</a></li>
            </ul>
          </div>

          {/* Vendedores */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Vendedores</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Vender produtos</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Anunciar</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Taxas</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Central do vendedor</a></li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Conecte-se</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors duration-200" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 20.25c-2.018 0-3.654-1.636-3.654-3.654s1.636-3.654 3.654-3.654 3.654 1.636 3.654 3.654-1.636 3.654-3.654 3.654zm7.718 0c-2.018 0-3.654-1.636-3.654-3.654s1.636-3.654 3.654-3.654 3.654 1.636 3.654 3.654-1.636 3.654-3.654 3.654z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm">
            © 2025 MercadoLibre Clone. Todos os direitos reservados. | 
            <a href="#" className="ml-1 hover:text-white transition-colors duration-200">Política de Privacidade</a> | 
            <a href="#" className="ml-1 hover:text-white transition-colors duration-200">Termos de Uso</a>
          </p>
        </div>
      </div>
    </footer>
  )
}