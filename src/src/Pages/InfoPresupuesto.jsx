import React from "react";
import FormPresupuesto from "../Components/Formularios/FormPresupuesto";

const InfoPresupuesto = ({ registerID, onContinue, onReturn, dts }) => {
  return (
    <div className="pag-container">
      <FormPresupuesto
        dts={dts}
        onContinue={onContinue}
        registerID={registerID}
        onReturn={onReturn}
      />
    </div>
  );
};

export default InfoPresupuesto;
