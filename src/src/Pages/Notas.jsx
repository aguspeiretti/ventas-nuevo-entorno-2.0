import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Notas = ({ onReturn, dts }) => {
  const [nota, setNota] = useState("");
  const rEgisterID = dts.data.EntityId;
  const [remainingChars, setRemainingChars] = useState(1900);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(4);
  const [formData, setFormData] = useState({
    id: rEgisterID,
    nota: "",
    Actualizar_No_Procesada: true,
  });

  useEffect(() => {
    setRemainingChars(1900 - nota.length);
  }, [nota]);

  useEffect(() => {
    setFormData({
      ...formData,
      Comentarios_cerrado_correcto: nota,
      Actualizar_No_Procesada: true,
    });
  }, [nota]);

  const config = {
    Entity: "Deals",
    APIData: formData,
    Trigger: ["workflow"],
  };

  async function updateRecord(config) {
    try {
      const data = await window.ZOHO.CRM.API.updateRecord(config);
      return data;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `${error}`,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
      });
      throw error;
    }
  }

  const guardarDatos = () => {
    return new Promise((resolve, reject) => {
      updateRecord(config)
        .then((resultado) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...resultado.data,
          }));

          Swal.fire({
            title: "Éxito",
            text: "¡Los datos se actualizaron correctamente!",
            icon: "success",
            toast: true,
            position: "top-end",
            timer: 2000,
            showConfirmButton: false,
          });
          resolve();
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al actualizar los datos. Por favor, inténtalo de nuevo.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            position: "top-end",
          });
          reject(error);
        });
    });
  };

  const handleChange = (event) => {
    const text = event.target.value;
    if (text.length <= 1900) {
      setNota(text);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nota) {
      Swal.fire({
        title: "Error",
        text: "Por favor completa las notas.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
      return;
    }

    setLoading(true);

    try {
      await guardarDatos();
      setTimeout(() => {
        window.ZOHO.CRM.BLUEPRINT.proceed();
      }, 2000);
    } catch (error) {
      console.error("Error al guardar datos:", error);
    }
  };

  const handleReturn = (event) => {
    event.preventDefault();
    onReturn();
  };

  const cerrar = () => {
    window.ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
      console.log(data);
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="w-64 bg-white shadow-lg p-6 border-r border-gray-200">
        <div className="space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-6">
            {[
              { title: "Información de Trato", step: 1 },
              { title: "Información de Proyecto", step: 2 },
              { title: "Información Final", step: 3 },
              { title: "Comentario coordinador", step: 4 },
            ].map((section) => (
              <div key={section.step} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= section.step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {section.step}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep >= section.step
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {section.title}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={cerrar}
            className={`px-4 py-2 rounded-lg text-white transition-colors  bg-red-600 hover:bg-red-700"
            }`}
          >
            cerrar
          </button>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-full mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Comentario para el coordinador
            </h1>
            <div className="space-x-4">
              <button
                onClick={handleReturn}
                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Guardando..." : "Guardar y cerrar"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b">
              Cerrado correcto
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Resuma los cambios realizados en el cerrado correcto
            </p>
            <div className="space-y-4">
              <textarea
                value={nota}
                onChange={handleChange}
                rows={12}
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Redacte los cambios"
              />
              <p className="text-sm text-gray-500">
                Caracteres restantes: {remainingChars}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notas;
