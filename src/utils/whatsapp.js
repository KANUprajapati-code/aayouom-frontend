export const generateWhatsAppLink = (cart, customerInfo) => {
  const phone = "911234567890"; // Replace with actual business number
  
  let message = `*NEW ORDER FROM WEDOME*\n\n`;
  message += `*Customer Details:*\n`;
  message += `Name: ${customerInfo.name}\n`;
  message += `Phone: ${customerInfo.phone}\n`;
  message += `Address: ${customerInfo.address}\n\n`;
  
  message += `*Products:*\n`;
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
  });
  
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  message += `\n*Order Subtotal: ₹${subtotal}*\n`;
  message += `\nThank you for shopping with Wedome! Please confirm the order.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
