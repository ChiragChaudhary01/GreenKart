import OrderModel from "../models/OrderModel.js";

const deliveryController = {
  // GET /delivery/orders → View assigned orders
  getAll: async (req, res) => {
    const id = req.user.user_id;
    try {
      const rows = await OrderModel.getAllForDeliveryPerson(id);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  //   PUT /delivery/orders/:id → Update delivery status
  updateStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !id)
      return res.status(400).json({ error: "All feilds are required" });
    try {
      await OrderModel.updateDelivery(id, status);
      res.json({ message: "Delivery status delivery_id updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
};

export default deliveryController;
