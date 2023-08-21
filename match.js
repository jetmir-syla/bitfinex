function matchOrders(order, orderBook) {
  const type = order.type;
  const price = order.price;
  const oppositeType = type === "buy" ? "sell" : "buy";
  const oppositeOrders = orderBook[oppositeType];

  oppositeOrders.sort((a, b) => {
    if (oppositeType === "buy") {
      return b.price - a.price;
    } else if (oppositeType === "sell") {
      return a.price - b.price;
    }
  });

  for (let i = 0; i < oppositeOrders.length && order.quantity > 0; i++) {
    const oppositeOrder = oppositeOrders[i];
    if (
      (type === "buy" && price >= oppositeOrder.price) ||
      (type === "sell" && price <= oppositeOrder.price)
    ) {
      console.log("Orders matched!");
      const tradeQuantity = Math.min(order.quantity, oppositeOrder.quantity);

      oppositeOrder.quantity -= tradeQuantity;
      order.quantity -= tradeQuantity;

      if (oppositeOrder.quantity === 0) {
        oppositeOrders.splice(i, 1);
        i--;
      }

      if (order.quantity === 0) {
        break;
      }
    }
  }

  if (order.quantity > 0) {
    orderBook[type].push(order);
    if (type === "buy") {
      orderBook[type].sort((a, b) => b.price - a.price);
    } else if (type === "sell") {
      orderBook[type].sort((a, b) => a.price - b.price);
    }
  }
  return orderBook;
}

module.exports = matchOrders;
