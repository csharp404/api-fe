import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import SpinnerLoading from "../GeneralBlock/Spinner";

const DiagnosisCard = () => {
  const { id } = useParams();
  const [diagnosis, setDiagnosis] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/AllDiagnosis?id=${id}`
        );
        setDiagnosis(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id]);

  if (loading) return <SpinnerLoading message={t("Loading Diagonsis...")} />;
  if (error) return <div className="text-danger mt-4">{t("Error")}: {error}</div>;
  if (!diagnosis || diagnosis.length === 0)
    return <div className="text-muted mt-4">{t("No diagnosis data available.")}</div>;

  return (
    <div className="container mt-4" style={{ direction }}>
      {diagnosis.map((ele, index) => (
        <div className="card shadow-sm mb-3" key={index}>
          <div className="card-header text-center-title text-white">
            <h5 className="mb-0">{t("Diagnosis Details")}</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <strong className="form-label">{t("Patient Name")}:</strong>
              <p className="mb-1">{ele.patientName}</p>
            </div>
            <div className="mb-3">
              <strong className="form-label">{t("Symptoms")}:</strong>
              <p className="mb-1">{ele.symptoms}</p>
            </div>
             <div className="mb-3">
              <strong className="form-label">{t("Diagnosis")}:</strong>
              <p className="mb-1">{ele.description}</p>
            </div>
            <div className="mb-3">
              <strong className="form-label">{t("Notes")}:</strong>
              <p className="mb-1">{ele.notes || "No Notes Provided."}</p>
            </div>
          </div>
          <div className="card-footer bg-primary text-white text-center-title">
            <span className="text-white text-center-title">
              {t("Last Updated")}: {new Date(ele.created).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiagnosisCard;
