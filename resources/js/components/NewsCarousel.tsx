"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import imgDefault from '../../images/placeholder.svg';


interface NewsArticle {
  title: string
  description: string
  href: string
  image: string
  published_at: string
  language: string
  author: string | null
  body: string
}

// Iconos SVG simples
const ClockIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={`h-3 w-3 ${className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
)

export function NewsCarousel() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Datos de noticias de respaldo en caso de que falle la API
  const mockNews: NewsArticle[] = [
    {
      title: "El sector rural impulsa la economía local",
      description: "Nuevas políticas agrarias promueven el desarrollo sostenible en comunidades rurales",
      href: "#",
      image: "/images/news/news1.svg",
      published_at: "2025-07-14T10:30:00Z",
      language: "es",
      author: "Agro Noticias",
      body: "Las comunidades rurales están experimentando un crecimiento significativo gracias a las nuevas políticas implementadas."
    },
    {
      title: "Innovación tecnológica en el campo",
      description: "Agricultores adoptan nuevas tecnologías para mejorar la producción y reducir el impacto ambiental",
      href: "#",
      image: "/images/news/news2.svg",
      published_at: "2025-07-13T15:20:00Z",
      language: "es",
      author: "Tech Rural",
      body: "La digitalización del sector agrícola está transformando la manera en que se cultiva y se gestiona el ganado."
    },
    {
      title: "Récord en exportación de granos",
      description: "El sector agrícola reporta cifras históricas en exportación durante el último trimestre",
      href: "#",
      image: "/images/news/news3.svg",
      published_at: "2025-07-12T08:45:00Z",
      language: "es",
      author: "Economía Rural",
      body: "Las exportaciones de granos alcanzaron un nuevo récord histórico, superando todas las expectativas del mercado."
    },
    {
      title: "Jóvenes regresan al campo",
      description: "Nueva generación de agricultores apuesta por el desarrollo rural con enfoque sustentable",
      href: "#",
      image: "/images/news/news4.svg",
      published_at: "2025-07-11T14:30:00Z",
      language: "es",
      author: "Futuro Rural",
      body: "Cada vez más jóvenes están eligiendo regresar a sus comunidades rurales para desarrollar proyectos agrícolas innovadores."
    },
    {
      title: "Crisis hídrica afecta producción",
      description: "Productores implementan sistemas de riego eficientes ante la escasez de agua",
      href: "#",
      image: "/images/news/news5.svg",
      published_at: "2025-07-10T09:15:00Z",
      language: "es",
      author: "Clima Rural",
      body: "La escasez de agua está forzando a los productores a buscar alternativas más eficientes para el riego de sus cultivos."
    },
    {
      title: "Agricultura regenerativa gana terreno",
      description: "Más productores se suman a prácticas que mejoran la salud del suelo y capturan carbono",
      href: "#",
      image: "/images/news/news1.svg",
      published_at: "2025-07-09T16:40:00Z",
      language: "es",
      author: "Agro Sostenible",
      body: "La agricultura regenerativa está demostrando ser una solución efectiva tanto para la producción de alimentos como para la crisis climática."
    }
  ]

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        
        // 1. Primero intentamos obtener noticias a través de nuestro proxy Laravel
        try {
          const apiUrl = '/api/news/rural'
          console.log("Fetching news from proxy:", apiUrl)
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          
          // Si la respuesta es exitosa y devuelve JSON válido
          if (response.ok) {
            const data = await response.json()
            
            if (data?.results && Array.isArray(data.results) && data.results.length > 0) {
              // Procesar los datos para que coincidan con la interfaz NewsArticle
              const processedNews = data.results.map((item: any, index: number) => ({
                title: item.title || '',
                description: item.description || '',
                href: item.href || '#',
                image: item.image || `/images/news/news${(index % 5) + 1}.svg`,
                published_at: item.published_at || new Date().toISOString(),
                language: item.language || 'es',
                author: item.author || item.source?.domain || 'APITube.io',
                body: item.body || item.description || ''
              }))
              
              setNews(processedNews)
              console.log("News fetched successfully from proxy:", processedNews.length, "articles")
              setLoading(false)
              return
            }
          }
          
          // Si llegamos aquí, no pudimos obtener datos válidos del proxy
          console.warn("Proxy API failed, trying direct API call")
        } catch (proxyError) {
          console.error("Error with proxy API:", proxyError)
        }
        
        // 2. Si el proxy falla, intentamos obtener directamente de la API externa
        const directResults = await fetchNewsDirectly()
        
        if (directResults && directResults.length > 0) {
          setNews(directResults)
          console.log("News fetched successfully from direct API:", directResults.length, "articles")
        } else {
          // 3. Si todo falla, usamos datos simulados
          console.warn("All API methods failed, using mock data")
          setNews(mockNews)
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        setNews(mockNews)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    if (news.length > 3) { // Solo iniciar el intervalo si hay suficientes noticias para hacer carousel
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          // Calcular el siguiente índice considerando la cantidad de noticias visibles
          const nextIndex = prevIndex + 1;
          // Si llegamos al final, volver al inicio
          if (nextIndex > news.length - 5) {
            return 0;
          }
          return nextIndex;
        });
      }, 10000); // Cambiar cada 4 segundos

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }
  }, [news.length])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Formato DD/MM/YYYY como se solicitó
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/')
  }

  // Función para intentar obtener noticias directamente de la API externa
  // Solo para desarrollo, no recomendado en producción ya que expone la API key
  const fetchNewsDirectly = async () => {
    try {
      const apiKey = '' // Solo para desarrollo
      const apiUrl = '' // Reemplazar con la URL real de la API externa
      
      console.log("Fetching news directly from external API")
      
      const response = await fetch(apiUrl, {
        headers: {
          'api_key': apiKey,
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`External API responded with status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data?.results && Array.isArray(data.results)) {
        // Procesar imágenes si es necesario
        const processedResults = data.results.map((item: any, index: number) => ({
          ...item,
          image: item.image || `/images/news/news${(index % 5) + 1}.svg`
        }))
        
        return processedResults
      }
    } catch (error) {
      console.error("Error fetching directly from external API:", error)
    }
    
    return null
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden m-4 h-[90%] ">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="flex-shrink-0 w-75 bg-card border-border animate-pulse">
            <CardContent className="p-4">
              <div className="h-40 bg-muted rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const visibleNews = news.slice(currentIndex, currentIndex + 5)

  return (
    <div className="relative overflow-hidden m-4 h-full">
      <div className="flex max-h-[85%] gap-4 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(0)` }}>
        {visibleNews.map((article, index) => (
          <Card
            key={`${currentIndex}-${index}`}
            className="flex-shrink-0 w-75 bg-card border-border hover:bg-accent transition-colors group cursor-pointer"
            onClick={() => article.href && window.open(article.href, '_blank')}
          >
            <CardContent className="p-4">
              <div className="relative mb-3 rounded-lg overflow-hidden">
                <img
                  src={article.image || imgDefault}
                  alt={article.title}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Si la imagen falla en cargar, usar la imagen por defecto
                    (e.target as HTMLImageElement).src = imgDefault;
                  }}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-card-foreground font-medium text-sm line-clamp-2 group-hover:text-access transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-xs line-clamp-2">{article.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ClockIcon />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                  <ExternalLinkIcon className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: Math.max(0, news.length - 3) }).map((_, index) => (
          <div
            key={index}
            className={`h-1 w-8 rounded-full transition-colors ${
              index === currentIndex ? "bg-access" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
