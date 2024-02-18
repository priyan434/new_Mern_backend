const createOder = async (customer, data, lineItems) => {
  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: lineItems.data,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });
  try {
    const saveorder = await newOrder.save();
    console.log("processed order", saveorder);

    const doc = new jsPDF();

    doc.text(
      "your Order details \n" +
        "Your email: " +
        saveorder.email.toString() +
        "\n\n" +
        "Your id: " +
        saveorder.userId.toString() +
        "\n\n" +
        "Payment Id: " +
        saveorder.paymentIntentId.toString() +
        "\n\n" +
        "Total amount: " +
        (saveorder.total / 100).toString() +
        "\n\n" +
        "Delivery_status: " +
        saveorder.delivery_status.toString() +
        "\n\n" +
        "Payment_status: " +
        saveorder.payment_status.toString(),
      10,
      20
    );

    doc.save("a4.pdf");
  } catch (err) {
    console.log(err);
  }
};
