import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const DrugWarehouse = () => {
   const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const navigation = useNavigate();
  const [drugs, setDrugs] = useState([]);
  const [newDrug, setNewDrug] = useState({
    id: "",
    name: "",
    qty: "",
    expiryDate: "",
  });
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");

  // Fetch drugs on component mount and when drugs state changes
  useEffect(() => {
    axios
      .get("https://localhost:7127/api/Generic/get-drug")
      .then((response) => {
        setDrugs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching drugs:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDrug({ ...newDrug, [name]: value });
  };

  const handleSearchChangeId = (e) => {
    setSearchId(e.target.value);
  };

  const handleSearchChangeName = (e) => {
    setSearchName(e.target.value);
  };

  const handleAddDrug = (e) => {
    e.preventDefault();
    if (newDrug.name && newDrug.qty && newDrug.expiryDate) {
      axios
        .post("https://localhost:7127/api/Generic/create-drug", newDrug)
        .then(() => {
          setNewDrug({ name: "", qty: "", expiryDate: "" }); // Reset the form
        })
        .catch((error) => {
          console.error("Error adding drug:", error);
        });
    }
  };

  const filteredDrugs = drugs.filter(
    (drug) =>
      drug.name.toLowerCase().includes(searchName.toLowerCase()) &&
      drug.id.toString().includes(searchId)
  );

  const getBackgroundColor = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const differenceInDays = (expiry - today) / (1000 * 60 * 60 * 24);

    if (differenceInDays < 0) {
      return "red"; // Expired
    } else if (differenceInDays <= 3) {
      return "orange"; // Close to expiry (3 days or less)
    } else if (differenceInDays > 30) {
      return "green"; // More than a month
    }
    return "transparent"; // Default background
  };

  return (
    <div className="container mt-5" style={{ direction }}>
      <h1 className="text-center-title mb-4 py-3 text-white rounded shadow-sm">
        {t("Drug Warehouse")}
      </h1>

      {/* Search Bar */}
      <div className="filter-container d-flex flex-row gap-3">
        <input
          type="text"
          className="form-filter"
          placeholder={t("Search by ID")}
          value={searchId}
          onChange={handleSearchChangeId}
          aria-label="Search by ID"
        />
        
        <input
          type="text"
          className="form-filter"
          placeholder={t("Search by Name")}
          value={searchName}
          onChange={handleSearchChangeName}
          aria-label="Search by Name"
        />
      </div>

      {/* Drug List Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>{t("Serial Number")}</th>
              <th>{t("Drug Name")}</th>
              <th>{t("Quantity")}</th>
              <th>{t("Expiry Date")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrugs.map((drug, index) => (
              <tr
                key={index}
                style={{ backgroundColor: getBackgroundColor(drug.expiryDate) }}
              >
                <td>{drug.id}</td>
                <td>{drug.name}</td>
                <td>{drug.qty}</td>
                <td>
                  {new Date(drug.expiryDate).toLocaleDateString()}{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill={getBackgroundColor(drug.expiryDate)}
                    className="bi bi-circle-fill ms-2"
                    viewBox="0 0 16 16"
                    aria-label={`Status indicator for expiry date ${drug.expiryDate}`}
                  >
                    <circle cx="8" cy="8" r="8" />
                  </svg>
                </td>
              </tr>
            ))}
            {filteredDrugs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  {t("No Drugs Found.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Drug Form */}
      <div className="card mt-4">
        <div className="card-header">{t("Add New Drug")}</div>
        <div className="card-body">
          <form onSubmit={handleAddDrug}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                {t("Drug Name")}
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newDrug.name}
                onChange={handleInputChange}
                required
              />
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
                value={newDrug.qty}
                onChange={handleInputChange}
                required
                min={"1"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label mt-3">
                {t("Expiry Date")}
              </label>
              <input
                type="date"
                className="form-control"
                id="expiryDate"
                name="expiryDate"
                value={newDrug.expiryDate}
                onChange={handleInputChange}
                min={new Date(new Date().setDate(new Date().getDate() + 2))
                  .toISOString()
                  .split("T")[0]} // Calculate tomorrow's date
                required
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>
            <button type="submit" className="major-btn mt-3">
              {t("Add")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DrugWarehouse;
