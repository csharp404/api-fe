import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Ensure you have this imported
import { useTranslation } from "react-i18next";

const DrugOrderForm = () => {
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [orders, setOrders] = useState([]);
  const [nameLoggedUser, setNameLoggedUser] = useState("");
  const [order, setOrder] = useState({
    drugId: "",
    requestedBy: "",
    name: "",
    note: "",
    qty: "",
  });

  const getTokenData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const userData = getTokenData();

  useEffect(() => {
    

     axios
        .get(`https://localhost:7127/api/User/user/${userData.Id}`)
      .then((response) => {
        const fullName = `${response.data.doctorsCard.firstName} ${response.data.doctorsCard.lastName}`;
        
        
        setNameLoggedUser(fullName);
        setOrder((prevOrder) => ({
          ...prevOrder,
          requestedBy: fullName,
        }));
      })
      .catch((error) => {
        console.error(t("Error Loading Doctor Data:"), error);
      });
  }, [userData.id]);

  const [drugs, setDrugs] = useState([]);

  // Fetch drugs and orders on component mount
  useEffect(() => {
    axios
      .get("https://localhost:7127/api/Generic/get-drug")
      .then((response) => {
        setDrugs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching drugs:", error);
      });

    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("https://localhost:7127/api/Generic/get-orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (order.requestedBy && order.drugId && order.qty) {
      axios
        .post("https://localhost:7127/api/Generic/create-order", order)
        .then(() => {
          setOrder({
            requestedBy: nameLoggedUser,
            drugId: "",
            qty: "",
            note: "",
          });
          fetchOrders();
        })
        .catch((error) => {
          console.error("Error creating order:", error);
        });
    }
  };

  return (
    <div className="container mt-5" style={{ direction }}>
      <h1 className="text-center-title mb-4 py-3 text-white rounded shadow-sm">
        {t("Drug Order Form")}
      </h1>

      {/* Order Form */}
      <div className="card">
        <div className="card-header">{t("Place a New Order")}</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="requestedBy" className="form-label">
                {t("Requested By")}
              </label>
              <input
                type="text"
                className="form-control"
                id="requestedBy"
                name="requestedBy"
                value={order.requestedBy}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="drugId" className="form-label mt-3">
                {t("Drug Name")}
              </label>
              <select
                className="form-select form-select-lg"
                id="drugId"
                name="drugId"
                value={order.drugId}
                onChange={handleInputChange}
                required
              >
                <option value="">{t("Select a Drug")}</option>
                {drugs.map((drug) => (
                  <option key={drug.id} value={drug.id}>
                    {drug.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="qty" className="form-label mt-3">
                {t("Quantity")}
              </label>
              <input
                type="number"
                className="form-control"
                id="qty"
                name="qty"
                value={order.qty}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="note" className="form-label mt-3">
                {t("Comments")}
              </label>
              <textarea
                className="form-control"
                id="note"
                name="note"
                rows="3"
                value={order.note}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button type="submit" className="major-btn mt-3">
              {t("Submit")}
            </button>
          </form>
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-4">
        <h2>{t("Order History")}</h2>
        {orders.length === 0 ? (
          <p className="text-muted">{t("No Orders Placed Yet.")}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-light">
                <tr>
                  <th>{t("Serial Number")}</th>
                  <th>{t("Requested By")}</th>
                  <th>{t("Drug Name")}</th>
                  <th>{t("Quantity")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Note")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.id}</td>
                    <td>{order.requestedBy}</td>
                    <td>{order.drug.name || "N/A"}</td>
                    <td>{order.qty}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: order.status === 1 ? "green" : "orange",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "5px",
                        }}
                      >
                        {order.status === 1 ? t("Fulfilled") : t("Pending")}
                      </span>
                    </td>
                    <td>{order.note || t("N/A")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugOrderForm;
