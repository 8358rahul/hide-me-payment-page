import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash,
  Check,
  CrossIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ProductItems {
  id:number,
  title:string,
  price:number,
  description:string,
  category:string,
  image:string
  rating: {
    rate: number;
    count: number;
  };
}
        const rozorpayKey = import.meta.env.VITE_RAZORPAY_KEY;


export default function EcommerceProduct() {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [products, setProducts] = useState<ProductItems[]>([]);
  const [showCart, setShowCart] = useState(false); // For cart toggle

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    };
    getProducts();
  }, []);

  const addToCart = (product: ProductItems) => {
    const existingItem = cart.find((item: CartItem) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item: CartItem) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.title,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
 

  const initiatePayment = () => {
    const options: RazorpayOrderOptions = {
      key: rozorpayKey,
      amount: totalAmount * 100,
      currency: "INR",
      name: "Neo Store",
      description: "Payment for your order",
      handler: function (response: unknown) { 
        console.log(response);
        setPaymentSuccess(true);
        setCart([]);
        setShowCart(false);
        alert("Payment successful! Thank you for your order.");
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      order_id: ""
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      {/* Cart Icon Top-Right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          className="relative"
          onClick={() => setShowCart(!showCart)}
        >
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Neo Store</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.map((product: ProductItems) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain rounded-lg p-4"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                  INR {product.price.toFixed(2)}
                  </span>
                  <Button onClick={() => addToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div> 
                <div className="mt-2 text-sm text-gray-600">
                  Rating: {product.rating.rate} ({product.rating.count} reviews)
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Slide-Up/Sticky Cart Footer */}
      {showCart && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg p-4 md:p-6 max-h-[60vh] overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Cart
              </CardTitle>
              {/* show close icon right side */}
            </CardHeader>
            <CrossIcon
              className="absolute top-4 right-4 h-6 w-6 cursor-pointer text-red-800 hover:text-gray-700"
              onClick={() => setShowCart(false)}
            />

            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            INR {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="flex justify-between w-full font-bold text-lg">
                <span>Total:</span>
                <span>INR {totalAmount.toFixed(2)}</span>
              </div>
              {paymentSuccess ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span>Payment successful! Thank you for your order.</span>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={initiatePayment}
                  disabled={cart.length === 0}
                >
                  Proceed to Payment
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
