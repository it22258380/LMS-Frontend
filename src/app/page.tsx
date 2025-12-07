//import { Navbar } from '@/components/Navbar'; // Client Component with useAuth()
import { FeatureHighlight } from '../components/layout/FeatureHighlight'; // Static Client Component  
import { HeroSection } from '../components/layout/HeroSection'; // Client Component with role logic
import { FeaturedBooks } from '../components/books/FeaturedBooks'; // Server/Client hybrid

// Define a basic Book type for the featured list
interface Book {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string;
}

// async function getFeaturedBooks(): Promise<Book[]> {
//   // base URL
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
//   try {
//     const res = await fetch(`${API_URL}/books`, { 
//         next: { revalidate: 3600 } 
//     });
    
   
//     if (!res.ok) {
       
//         console.error(`Failed to fetch featured books. Status: ${res.status}`);
//         return []; 
//     }
    
//     return res.json();
//   } catch (error) {
//     console.error("Network or Fetch Error:", error);
//     return [];
//   }
// }

export default async function HomePage() {
  //const featuredBooks = await getFeaturedBooks();
    
  return (
    <div className="min-h-screen bg-gray-50">
       
        {/* <Navbar /> */}

        <main>
           
            <HeroSection />

            {/* Featured Section (Universal) */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-semibold mb-8 text-gray-800 border-b pb-2">
                    🔥 Trending Now: Popular Reads
                </h2>
                <FeaturedBooks books={[]} />
            </section>

            {/* Feature Highlights Section */}
            <section className="bg-gray-100 py-16 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Our Library Management System?</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Static component highlighting User features */}
                        <FeatureHighlight 
                            title="For Our Members" 
                            features={["Advanced Search & Filters", "One-Click Book Reservation", "Personalized Profile & History"]}
                            ctaText="Start Browsing"
                            ctaLink='/login'
                           
                        />
                        {/* Static component highlighting Librarian features */}
                        <FeatureHighlight 
                            title="For Our Librarians" 
                            features={["Dashboard", "Inventory & Status Control", "Administrative User Blacklisting"]}
                            ctaText="Go to Dashboard"
                            ctaLink="/login"
                           
                        />
                    </div>
                </div>
            </section>
        </main>
    </div>
  );
}