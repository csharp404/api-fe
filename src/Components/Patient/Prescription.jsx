import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import SpinnerLoading from "../GeneralBlock/Spinner";

export default function PrescriptionDetails() {
    const {id}  = useParams();
  const [prescription, setPrescription] = useState(null);
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch prescription details
    axios
      .get(`https://localhost:7127/api/Generic/Precription?id=${id}`)
      .then((response) => {
        setPrescription(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching prescription details:", error);
      });
  }, [id]);

if (loading) {
    return <SpinnerLoading message={t("Loading Nurse Data, Please Hold On...")} />;
  }
 

  return (
    <div className="container mt-5" style={{ direction }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center-title">
              <h3>{t("Prescription Details")}</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong className="form-label">{t("Patient Name:")}</strong>
                <p>{prescription.patientName}</p>
              </div>

              <div className="mb-3">
                <strong className="form-label">{t("Medication")}:</strong>
                <p>{prescription.medication}</p>
              </div>

              <div className="mb-3">
                <strong className="form-label">{t("Dosage")}:</strong>
                <p>{prescription.dosage}</p>
              </div>

              <div className="mb-3">
                <strong className="form-label">{t("Instructions")}:</strong>
                <p>{prescription.instructions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
