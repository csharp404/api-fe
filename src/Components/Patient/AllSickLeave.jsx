import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const SickLeaveList = () => {
  const [sickLeaves, setSickLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} = useParams();
  const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';


  useEffect(() => {
    const fetchSickLeaves = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/AllSickLeave?id=${id}`
        );
        setSickLeaves(response.data);
      } catch (err) {
        setError("Failed to load sick leaves. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSickLeaves();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">{t("Loading...")}</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4" style={{ direction }}>
      <h2 className="text-center-title mb-4 text-white bg-primary py-3 rounded-top">{t("Sick Leaves")}</h2>
      {sickLeaves[0].patientName!=null && <h3><b>{t("Patient Name")} : </b>{sickLeaves[0].patientName}</h3>}
      <table className="table table-hover">
        <thead className="">
          <tr>
            <th>{t("Duration")} ({t("Days")})</th>
            <th>{t("Start Date")}</th>
            <th>{t("End Date")}</th>
            <th>{t("Reason")}</th>
            <th>{t("Created At")}</th>
          </tr>
        </thead>
        <tbody>
          {sickLeaves.map((leave, index) => (
            <tr key={index}>
              <td>{leave.duration}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.reason}</td>
              <td>{new Date(leave.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SickLeaveList;
