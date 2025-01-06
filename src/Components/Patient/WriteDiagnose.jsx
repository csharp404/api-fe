import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Import axios
import { useTranslation } from "react-i18next"; // Import for translations
import ToastMessage from "../GeneralBlock/ToastMsg";

export default function WriteDiagnosis() {
  const { id } = useParams();
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [toastMessage, setToastMessage] = useState(null); // State to handle toast visibility

  const [formData, setFormData] = useState({
    symptoms: "",
    description: "",
    notes: "",
    patientId: id, // Ensure patientId is initialized correctly
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7127/api/Generic/Create-Diagnosis", formData);
      setFormData((prev) => ({
        ...prev,
        symptoms: "",
        description: "",
        notes: "",
      }));
      navigate(`/diagnosis/${id}`)
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
     
    }
  };

  return (
    <div className="container mt-5" style={{ direction }}>
    <div className="row justify-content-center">
      <div className="col-md-8">
          <div className="">
      <form onSubmit={handleSubmit} className="card p-4 rounded shadow-lg ">
        <div className=" text-white text-center-title pt-2 ">
          <h2 >{t("Diagnosis Form")}</h2>
          </div>

        <div className="mt-3">
          <label htmlFor="symptoms" className="form-label">
            {t("Symptoms")}:
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            className="form-control"
            placeholder={t("Enter Symptoms")}
          ></textarea>
        </div>

        <div className="mt-3">
          <label htmlFor="diagnosis" className="form-label">
            {t("Diagnosis")}:
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-control"
            placeholder={t("Enter Diagnosis")}
          />
        </div>

        <div className="mt-3">
          <label htmlFor="notes" className="form-label">
            {t("Notes")}:
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-control"
            placeholder={t("Add any additional notes (mandatory)")}
          ></textarea>
        </div>

        <div className="text-center">
          <button type="submit" className="mt-3 major-btn">
            {t("Submit")}
          </button>
        </div>
      </form>
      </div>
          </div>
        </div>
    </div>
  );
}
