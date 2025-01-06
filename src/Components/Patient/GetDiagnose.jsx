import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import SpinnerLoading from "../GeneralBlock/Spinner";

const DiagnosisCard = () => {
  const { id } = useParams();
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(`https://localhost:7127/api/Generic/Diagnosis?id=${id}`);
        setDiagnosis(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id]);

  if (loading) return <SpinnerLoading message={t("Loading Diagonse...")} />;
  
  if (error) return <div className="text-danger mt-4">{t("Error")}: {error}</div>;
  console.log(diagnosis);
  
  if (diagnosis.description==null) return <div className="text-muted mt-4">{t("No diagnosis data available.")}</div>;

  return (
    <div className="container mt-4" style={{ direction }}>
      <div className="card">
        <div className="card-header bg-primary text-white text-center-title">
          <h5 className="">{t("Diagnosis Details")}</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong className="form-label">{t("Patient Name")}:</strong>
            <p className="mb-1">{diagnosis.patientName}</p>
          </div>
          
          <div className="mb-3">
            <strong className="form-label">{t("Symptoms")}:</strong>
            <p className="mb-1">{diagnosis.symptoms}</p>
          </div>
          <div className="mb-3">
            <strong className="form-label">{t("Diagnosis")}:</strong>
            <p className="mb-1">{diagnosis.description}</p>
          </div>
          <div className="mb-3">
            <strong className="form-label">{t("Notes")}:</strong>
            <p className="mb-1">{diagnosis.notes || "No Notes Provided."}</p>
          </div>
        </div>
        <div className="card-footer bg-primary text-white text-center-title">
          <span className="text-white text-center-title">{t("Last Updated")}: {new Date(diagnosis.created).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisCard;
