import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const emptyItem = {
    name: "",
    description: "",
    category: "Food",
    price: "",
    image_url: "/images/masala_dosa.jpg",
    available: true,
    featured: false,
  };

  const [newItem, setNewItem] = useState(emptyItem);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      const statsRes = await api.get("/admin/stats");
      const ordersRes = await api.get("/orders/");
      const menuRes = await api.get("/menu/");

      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (file, setter, currentData) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/menu/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setter({
      ...currentData,
      image_url: res.data.image_url,
    });
  };

  const addItem = async (e) => {
    e.preventDefault();

    await api.post("/menu/", {
      ...newItem,
      price: Number(newItem.price),
    });

    setNewItem(emptyItem);
    setShowAddModal(false);
    loadDashboard();
  };

  const startEdit = (item) => {
    setEditingItem({
      ...item,
      price: String(item.price),
    });
  };

  const updateItem = async (e) => {
    e.preventDefault();

    await api.put(`/menu/${editingItem.id}`, {
      name: editingItem.name,
      description: editingItem.description,
      category: editingItem.category,
      price: Number(editingItem.price),
      image_url: editingItem.image_url,
      available: editingItem.available,
      featured: editingItem.featured,
    });

    setEditingItem(null);
    loadDashboard();
  };

  const updateStatus = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    loadDashboard();
  };

  const toggleAvailability = async (itemId) => {
    await api.patch(`/menu/${itemId}/availability`);
    loadDashboard();
  };

  const toggleFeatured = async (itemId) => {
    await api.patch(`/menu/${itemId}/featured`);
    loadDashboard();
  };

  const deleteItem = async (itemId) => {
    if (!confirm("Delete this menu item?")) return;
    await api.delete(`/menu/${itemId}`);
    loadDashboard();
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    if (onLogout) {
      onLogout();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee]">
      <nav className="bg-white border-b-2 border-black px-10 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-black">🔥 EL FUEGO · ADMIN</h1>

        <div className="flex items-center gap-5">
          <span className="font-bold tracking-widest">
            {localStorage.getItem("adminEmail")}
          </span>

          <button
            onClick={logout}
            className="border-2 border-black px-6 py-3 font-black"
          >
            LOGOUT
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-10 py-10">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
            <Stat title="TOTAL ORDERS" value={stats.total_orders} />
            <Stat title="TODAY ORDERS" value={stats.today_orders} />
            <Stat title="PENDING" value={stats.pending} />
            <Stat title="READY" value={stats.ready} />
            <Stat title="MENU ITEMS" value={stats.menu_items} />

            <Stat title="TOTAL REVENUE" value={`₹${stats.revenue}`} red />
            <Stat title="TODAY REVENUE" value={`₹${stats.today_revenue}`} red />
            <Stat title="COMPLETED" value={stats.completed} />
            <Stat title="CANCELLED" value={stats.cancelled} />
            <Stat title="TOP ITEM" value={stats.top_selling_item} red />
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-8 py-3 border-2 border-black font-black ${
              activeTab === "orders"
                ? "bg-black text-white shadow-[4px_4px_0px_#ef3349]"
                : "bg-white"
            }`}
          >
            ORDERS
          </button>

          <button
            onClick={() => setActiveTab("menu")}
            className={`px-8 py-3 border-2 border-black font-black ${
              activeTab === "menu"
                ? "bg-black text-white shadow-[4px_4px_0px_#ef3349]"
                : "bg-white"
            }`}
          >
            MENU
          </button>
        </div>

        {activeTab === "orders" && (
          <>
            <h2 className="text-4xl font-black mb-6">ORDERS</h2>

            <div className="overflow-x-auto border-2 border-black bg-white">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-4 text-left">CODE</th>
                    <th className="p-4 text-left">CUSTOMER</th>
                    <th className="p-4 text-left">PHONE</th>
                    <th className="p-4 text-left">TOTAL</th>
                    <th className="p-4 text-left">STATUS</th>
                    <th className="p-4 text-left">ACTION</th>
                    <th className="p-4 text-left">VIEW</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-black">
                      <td className="p-4 font-bold">{order.order_code}</td>
                      <td className="p-4 font-bold">{order.customer_name}</td>
                      <td className="p-4">{order.phone}</td>
                      <td className="p-4 font-bold">₹{order.total_amount}</td>

                      <td className="p-4">
                        <span className="bg-black text-white px-3 py-1 font-bold">
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className="border-2 border-black p-2"
                        >
                          <option>Pending</option>
                          <option>Preparing</option>
                          <option>Ready</option>
                          <option>Completed</option>
                          <option>Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="border-2 border-black px-4 py-2 font-black hover:bg-black hover:text-white"
                        >
                          VIEW
                        </button>
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && (
                    <tr>
                      <td className="p-6 text-center font-bold" colSpan="7">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "menu" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-black">MENU MANAGEMENT</h2>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-red-500 text-white px-8 py-3 border-2 border-black shadow-[4px_4px_0px_black] font-black"
              >
                + ADD ITEM
              </button>
            </div>

            <div className="overflow-x-auto border-2 border-black bg-white">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-4 text-left">IMAGE</th>
                    <th className="p-4 text-left">ITEM</th>
                    <th className="p-4 text-left">CATEGORY</th>
                    <th className="p-4 text-left">PRICE</th>
                    <th className="p-4 text-left">AVAILABLE</th>
                    <th className="p-4 text-left">FEATURED</th>
                    <th className="p-4 text-left">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} className="border-b border-black">
                      <td className="p-4">
                        <img
                          src={
                            item.image_url?.startsWith("/uploads")
                              ? `${api.defaults.baseURL}${item.image_url}`
                              : item.image_url
                          }
                          className="w-16 h-16 object-cover border border-black"
                        />
                      </td>

                      <td className="p-4 font-bold">{item.name}</td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4 font-bold">₹{item.price}</td>

                      <td className="p-4">
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          className={`px-4 py-2 font-black text-white ${
                            item.available ? "bg-green-600" : "bg-gray-500"
                          }`}
                        >
                          {item.available ? "AVAILABLE" : "SOLD OUT"}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => toggleFeatured(item.id)}
                          className={`px-4 py-2 font-black ${
                            item.featured
                              ? "bg-yellow-400 text-black"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          {item.featured ? "⭐ YES" : "NO"}
                        </button>
                      </td>

                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="bg-black text-white px-4 py-2 font-black"
                        >
                          EDIT
                        </button>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="bg-red-500 text-white px-4 py-2 font-black"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}

                  {menuItems.length === 0 && (
                    <tr>
                      <td className="p-6 text-center font-bold" colSpan="7">
                        No menu items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {showAddModal && (
        <MenuItemModal
          title="ADD ITEM"
          item={newItem}
          setItem={setNewItem}
          onSubmit={addItem}
          onClose={() => setShowAddModal(false)}
          uploadImage={uploadImage}
        />
      )}

      {editingItem && (
        <MenuItemModal
          title="EDIT ITEM"
          item={editingItem}
          setItem={setEditingItem}
          onSubmit={updateItem}
          onClose={() => setEditingItem(null)}
          uploadImage={uploadImage}
        />
      )}
    </div>
  );
}

function MenuItemModal({
  title,
  item,
  setItem,
  onSubmit,
  onClose,
  uploadImage,
}) {
  const imagePreview = item.image_url?.startsWith("/uploads")
    ? `${api.defaults.baseURL}${item.image_url}`
    : item.image_url;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white w-full max-w-xl border-4 border-black shadow-[8px_8px_0px_#ef3349] p-8 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-black">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl font-black"
          >
            ✕
          </button>
        </div>

        {item.image_url && (
          <img
            src={imagePreview}
            className="w-full h-52 object-cover border-2 border-black"
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="w-full border-2 border-black p-3 font-bold"
          onChange={(e) => uploadImage(e.target.files[0], setItem, item)}
        />

        <input
          placeholder="Item name"
          className="w-full border-2 border-black p-3 font-bold"
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border-2 border-black p-3 font-bold"
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border-2 border-black p-3 font-bold"
          value={item.price}
          onChange={(e) => setItem({ ...item, price: e.target.value })}
          required
        />

        <select
          className="w-full border-2 border-black p-3 font-bold"
          value={item.category}
          onChange={(e) => setItem({ ...item, category: e.target.value })}
        >
          <option>Food</option>
          <option>Juices</option>
          <option>Combos</option>
          <option>Desserts</option>
        </select>

        <input
          placeholder="/images/example.jpg"
          className="w-full border-2 border-black p-3 font-bold"
          value={item.image_url}
          onChange={(e) => setItem({ ...item, image_url: e.target.value })}
          required
        />

        <label className="flex gap-3 font-black">
          <input
            type="checkbox"
            checked={item.available}
            onChange={(e) => setItem({ ...item, available: e.target.checked })}
          />
          Available
        </label>

        <label className="flex gap-3 font-black">
          <input
            type="checkbox"
            checked={item.featured}
            onChange={(e) => setItem({ ...item, featured: e.target.checked })}
          />
          Featured
        </label>

        <button className="w-full bg-red-500 text-white py-4 border-2 border-black shadow-[4px_4px_0px_black] font-black">
          SAVE ITEM
        </button>
      </form>
    </div>
  );
}

function OrderDetailsModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg border-4 border-black shadow-[8px_8px_0px_#ef3349] p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-black">ORDER DETAILS</h2>

          <button onClick={onClose} className="text-2xl font-black">
            ✕
          </button>
        </div>

        <p>
          <b>Code:</b> {order.order_code}
        </p>
        <p>
          <b>Customer:</b> {order.customer_name}
        </p>
        <p>
          <b>Phone:</b> {order.phone}
        </p>
        <p>
          <b>Pickup:</b> {order.pickup_time || "Not given"}
        </p>
        <p>
          <b>Notes:</b> {order.notes || "No notes"}
        </p>
        <p>
          <b>Status:</b> {order.status}
        </p>

        <div className="mt-6 border-2 border-black p-4 bg-[#f7f3ee]">
          <p className="font-black mb-3">ITEMS</p>

          {order.items?.length > 0 ? (
            order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-black py-2"
              >
                <span>
                  {item.item_name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))
          ) : (
            <p>No item details found.</p>
          )}
        </div>

        <p className="text-3xl font-black mt-6">Total: ₹{order.total_amount}</p>
      </div>
    </div>
  );
}

function Stat({ title, value, red }) {
  return (
    <div className="bg-white border-2 border-black p-5">
      <p className="tracking-[4px] text-sm font-black">{title}</p>
      <h3 className={`text-4xl font-black mt-2 ${red ? "text-red-500" : ""}`}>
        {value}
      </h3>
    </div>
  );
}