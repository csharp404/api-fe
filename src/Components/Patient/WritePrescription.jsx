import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ToastMessage from "../GeneralBlock/ToastMsg"; // Assuming you have the ToastMessage component

export default function WritePrescription() {
  const { id } = useParams();
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const navigate = useNavigate();
  const [drugs, setDrugs] = useState([]); // Initialize as an empty array
  const [prescription, setPrescription] = useState({
    Medication: "",
    dosage: "",
    instructions: "",
    patientId: id,
  });

  const [toastMessage, setToastMessage] = useState(null); // State to manage toast visibility and message

  useEffect(() => {
    axios
      .get("https://localhost:7127/api/Generic/get-drug")
      .then((response) => {
        setDrugs(response.data || []); // Fallback to empty array if data is null/undefined
      })
      .catch((error) => {
        console.error("Error fetching drugs:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prescription.Medication || !prescription.dosage || !prescription.instructions) {
      setToastMessage({ type: "error", message: t("All fields are required") });
      setTimeout(() => {
        setToastMessage(null); // Hide toast after 3 seconds
      }, 3000);
      return;
    }

    try {
      await axios.post(
        "https://localhost:7127/api/Generic/Create-Precription",
        prescription
      );
      // Show success toast message
      setToastMessage({ type: "success", message: t("Prescription Saved Successfully!") });

      // Reset form fields
      setPrescription({
        Medication: "",
        dosage: "",
        instructions: "",
        patientId: id,
      });

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);

      // Navigate to prescription page
    } catch (error) {
      console.error("Failed to submit the prescription:", error);

      // Show error toast message
      setToastMessage({ type: "error", message: t("Error saving prescription") });

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="container mt-5" style={{ direction }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center-title">
              <h3>{t("Prescription Form")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="Medication" className="form-label">{t("Drug Name")}</label>
                  <select
                    className="form-select"
                    id="Medication"
                    name="Medication"
                    value={prescription.Medication} // Bind to prescription.Medication
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t("Select a Drug")}</option>
                    {drugs.map((drug) => (
                      <option key={drug.id} value={drug.name}>
                        {drug.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3">
                  <label htmlFor="dosage" className="form-label">
                    {t("Dosage")}
                  </label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    className="form-control"
                    value={prescription.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mt-3">
                  <label htmlFor="instructions" className="form-label">
                    {t("Instructions")}
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    className="form-control"
                    value={prescription.instructions}
                    onChange={handleInputChange}
                    required
                    rows="4"
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="major-btn mt-3">
                    {t("Save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Toast message component */}
      {toastMessage && (
        <ToastMessage
          type={toastMessage.type}
          message={toastMessage.message}
        />
      )}
    </div>
  );
}
