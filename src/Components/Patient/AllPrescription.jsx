import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import SpinnerLoading from "../GeneralBlock/Spinner";

export default function AllPrescriptions() {
      const {id}  = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';


  useEffect(() => {
    // Fetch all prescriptions
    axios
      .get(`https://localhost:7127/api/Generic/AllPrecription?id=${id}`)
      .then((response) => {
        setPrescriptions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
        setError("Failed to fetch prescriptions.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <SpinnerLoading message={t("loading Prescription Tables...")} />;
  }

  if (error) {
    return (
      <div className="container mt-5 text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }
if(prescriptions[0]==null){
  return <div>{t("There is no Prescriptions")}</div>
  
}

  return (
    <div className="container mt-5" style={{ direction }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h3 className="text-center-title text-white pt-2 mb-4">{t("Prescriptions")}{prescriptions.at(0).patientName} </h3>
          {prescriptions.length === 0 ? (
            <p className="text-center">{t("No prescriptions available.")}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-primary">
                  <tr>
                  <th>{t("Created At")}</th>
                    <th>{t("Medication")}</th>
                    <th>{t("Dosage")}</th>
                    <th>{t("Instructions")}</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription, index) => (
                    <tr key={index}>
                        <td>{prescription.createdAt}</td>
                      <td>{prescription.medication}</td>
                      <td>{prescription.dosage}</td>
                      <td>{prescription.instructions}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
