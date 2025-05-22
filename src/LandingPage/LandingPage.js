'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";

const LandingPage = () =>{

const product = {
  title: "Tênis Esportivo X",
  price: "R$ 199,90",

  variants: {
    size: ["36", "37", "38", "39", "40", "41"],
    color: [
        {
             label: "Preto",
             source: "/black.jpg"
        },
       {
             label: "Branco",
             source: "/white.png"
        },
        {
             label: "Azul",
             source: "/blue.png"
        }
    ]
  }
};


  const [mainImage, setMainImage] = useState(product.variants.color[0].source);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("productPrefs");
    if (saved) {
      const { size, color, image, time } = JSON.parse(saved);
      if (Date.now() - time < 15 * 60 * 1000) {
        setSelectedSize(size);
        setSelectedColor(color);
        setMainImage(image);
      } else {
        localStorage.removeItem("productPrefs");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "productPrefs",
      JSON.stringify({
        size: selectedSize,
        color: selectedColor,
        image: mainImage,
        time: Date.now()
      })
    );
   
  }, [selectedSize, selectedColor, mainImage]);

  const handleCepSearch = async () => {
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!data.erro)
        {
          setAddress(data);
          toast.success("Confira seu CEP abaixo")
        } 
      else setAddress(null);
    } catch (err) {
      setAddress(null);
      toast.error("CEP inválido ou não encontrado.");

    }
  };
  
  return (
  <div className="p-6 max-w-4xl mx-auto font-sans bg-gradient-to-br from-white to-gray-100 min-h-screen">
  <div className="flex flex-col md:flex-row gap-6 shadow-lg bg-white p-6 rounded-xl items-center md:items-start">
    <div className="md:w-[35%]">
      <img src={mainImage} alt="Produto" className="w-full rounded" />
      <div className="flex gap-2 mt-2 justify-center md:justify-start">
        {product.variants.color.map((img, idx) => (
          <img
            key={idx}
            src={img.source}
            alt="Miniatura"
            className={`w-16 h-16 rounded cursor-pointer border transition-transform duration-200 transform hover:scale-125 ${mainImage === img.source ? "border-blue-500" : "border-gray-300"}`}
            onClick={() => {
              setMainImage(img.source);
              setSelectedColor(img.label);
            }}
          />
        ))}
      </div>
    </div>
    <Toaster position="top-right" reverseOrder={false} />
    <div className="md:w-2/3">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{product.title}</h1>
      <p className="text-xl text-green-600 font-semibold mb-4">{product.price}</p>

      <div className="mb-4">
        <label className="block font-semibold mb-1 text-gray-800">Tamanho</label>
        <div className="flex gap-2 flex-wrap">
          {product.variants.size.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 py-1 border rounded ${selectedSize === size ? "bg-blue-600 text-white" : "bg-white text-black"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1 text-gray-800">Cor</label>
        <div className="flex gap-2 flex-wrap">
          {product.variants.color.map((color) => (
            <button
              key={color.label}
              onClick={() => {
                setSelectedColor(color.label);
                setMainImage(color.source);
              }}
              className={`px-3 py-1 border rounded ${selectedColor === color.label ? "bg-blue-600 text-white" : "bg-white text-black"}`}
            >
              {color.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1 text-gray-800">Digite seu CEP</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="border px-3 py-1 rounded w-40 text-gray-800"
          />
          <button onClick={handleCepSearch} className="bg-blue-600 text-black px-4 py-1 rounded">
            Consultar
          </button>
        </div>
        {address && (
          <div className="mt-2 text-sm text-black">
            {address.logradouro}, {address.bairro} - {address.localidade}/{address.uf}
          </div>
        )}
      </div>
    </div>
  </div>
</div>

  );
}

export default LandingPage;