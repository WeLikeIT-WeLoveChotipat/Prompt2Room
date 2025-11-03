import Image from "next/image";
type ProductItem = {
  category: string;
  url: string;
  item_name: string;
};

interface ImageResultProps {
  imageUrl: string | null;
  prompt: string;
  products?: ProductItem[];
}

export default function ImageResult({ imageUrl, prompt, products = [] }: ImageResultProps) {
  if (!imageUrl) return null;

  // console.log("ImageResult received products:", products);
  // console.log("Products count:", products.length);

  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    const exists = acc[product.category].some(
      (p) => p.item_name.toLowerCase() === product.item_name.toLowerCase()
    );
  
    if (!exists) {
      acc[product.category].push(product);
    }
  
    return acc;
  }, {} as Record<string, ProductItem[]>)

  // console.log("Products by category:", productsByCategory);
  // console.log("Category count:", Object.keys(productsByCategory).length);

  return (
    <div className="mt-8 flex">
      <div className="text-center flex flex-col items-center justify-items-center">
        <Image
          src={imageUrl}
          width={2000}
          height={2000}
          alt="Generated Room"
          className="rounded-2xl shadow-lg w-[80%] object-cover"
        />
        <p className="text-gray-600 mt-2">ผลลัพธ์จาก Prompt: &quot;{prompt}&quot;</p>
      </div>

      {Object.keys(productsByCategory).length > 0 ? (
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-semibold text-black mb-4">สินค้าแนะนำตาม Category</h3>
          {Object.entries(productsByCategory).map(([category, items]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-xl font-semibold text-black mb-4 capitalize">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <p className="font-medium text-black mb-1">{item.item_name}</p>
                    <span className="text-xs text-blue-600 hover:underline">ดูรายละเอียด →</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ไม่พบข้อมูลสินค้า (Products count: {products.length})
          </p>
          {products.length > 0 && (
            <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(products, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
