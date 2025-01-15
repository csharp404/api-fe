import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SpinnerLoading from "../GeneralBlock/Spinner";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PdfSickLeave from "../GeneralBlock/pdfSickLeav";

const SickLeaveDetails = () => {
  const [sickLeave, setSickLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [show, setShow] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchSickLeave = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/SickLeave?id=${id}`
        );
        setSickLeave(response.data);
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

  const showDialog = () => {
    setShow(true);
  };

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
            <strong className="form-label">
              <i className="bi bi-person-fill"></i> {t("Name")}:
            </strong>{" "}
            {sickLeave.patientName}
          </p>
          <p>
            <strong className="form-label">
              <i className="bi bi-alarm-fill"></i> {t("Duration")} ({t("Days")}
              ):
            </strong>{" "}
            {sickLeave.duration}
          </p>
          <p>
            <strong className="form-label">
              <i className="bi bi-calendar-date-fill"></i> {t("Start Date")}:
            </strong>{" "}
            {new Date(sickLeave.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong className="form-label">
              <i className="bi bi-calendar-date-fill"></i> {t("End Date")}:
            </strong>{" "}
            {new Date(sickLeave.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong className="form-label">
              <i className="bi bi-h-circle-fill"></i> {t("Reason")}:
            </strong>{" "}
            {sickLeave.reason}
          </p>
          <p>
            <strong className="form-label">
              <i className="bi bi-calendar-date-fill"></i> {t("Created At")}:
            </strong>{" "}
            {new Date(sickLeave.createdAt).toLocaleString()}
          </p>
          <button
            onClick={showDialog}
            type="button"
            className="btn sm-btn btn-outline-success"
            data-toggle="modal"
            data-target="#ss"
          >
            Show as PDF <i className="bi bi-eye-fill"></i>
          </button>
          <br />
          <PDFDownloadLink
            document={<PdfSickLeave sickLeave={sickLeave} />}
            fileName={`sick-leave-${sickLeave.patientName}-details.pdf`}
          >
            {({ loading }) =>
              loading ? (
                "Loading document..."
              ) : (
                <button className="btn sm-btn btn-outline-success">
                  Download{" "}
                  <i style={{ color: "white" }} className="bi bi-download"></i>
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>

      {show && (
        <div
          className="modal fade show "
          id="ss"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <PDFViewer style={{ width: "100%", height: "600px" }}>
                  <PdfSickLeave sickLeave={sickLeave} />
                </PDFViewer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SickLeaveDetails;
