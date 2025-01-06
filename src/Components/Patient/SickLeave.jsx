import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SpinnerLoading from "../GeneralBlock/Spinner";
import { useTranslation } from "react-i18next";

const SickLeaveDetails = () => {
  const [sickLeave, setSickLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const { id } = useParams();

  useEffect(() => {
    const fetchSickLeave = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/SickLeave?id=${id}`
        );
        setSickLeave(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load sick leave details. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSickLeave();
  }, [id]);

  if (loading) {
    return <SpinnerLoading message={t("Loading Sick Leave...")} />;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  if (!sickLeave) {
    return <div className="text-center mt-5">{t("No data found.")}</div>;
  }

  return (
    <div className="container mt-4" style={{ direction }}>
      <h2
        className="text-center-title text-white mb-4 col-md-6 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        {t("Sick Leave Details")}
      </h2>
      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <p>
            <strong className="form-label">{t("Name")}:</strong>{" "}
            {sickLeave.patientName}
          </p>
          <p>
            <strong className="form-label">
              {t("Duration")} ({t("Days")}):
            </strong>{" "}
            {sickLeave.duration}
          </p>
          <p>
            <strong className="form-label">{t("Start Date")}:</strong>{" "}
            {new Date(sickLeave.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong className="form-label">{t("End Date")}:</strong>{" "}
            {new Date(sickLeave.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong className="form-label">{t("Reason")}:</strong>{" "}
            {sickLeave.reason}
          </p>
          <p>
            <strong className="form-label">{t("Created At")}:</strong>{" "}
            {new Date(sickLeave.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SickLeaveDetails;
