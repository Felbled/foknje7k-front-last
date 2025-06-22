import React, { useEffect, useState } from "react";
import { BoxStat, MontantStat, TotalStat, UserStat } from "../../../assets/svg";
import { getStatService } from "../../../services/playList-service";

const Stats = () => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    getStatService().then((res) => {
      console.log(res);
      setData(res.data);
    });
  }, []);

  return (
    <div className="w-full flex flex-col justify-center mb-10">
      <h1 className="text-title font-montserrat_bold text-3xl mb-10">
        Statestique
      </h1>
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="flex flex-col bg-white rounded-xl justify-between w-full md:w-1/5 p-5 mb-4 md:mb-0 md:mx-2">
          <div className="flex justify-between w-full">
            <p className="font-montserrat_semi_bold text-text text-lg">
              Total Utilisateur
            </p>
            <img src={UserStat} alt="total" className="h-6 w-6" />
          </div>
          <p className="text-xl text-title font-montserrat_bold">
            {data?.totalUsers}
          </p>
        </div>
        <div className="flex flex-col bg-white rounded-xl  justify-between  w-full md:w-1/5 p-5 mb-4 md:mb-0 md:mx-2">
          <div className={"flex justify-between w-full"}>
            <p className={"font-montserrat_semi_bold text-text text-lg"}>
            Ordres actifs
            </p>
            <img src={BoxStat} alt="total" className="h-6 w-6" />
          </div>
          <p className="text-xl text-title font-montserrat_bold">
            {data?.totalOrders}
          </p>
        </div>
        <div className="flex flex-col bg-white rounded-xl justify-between w-full md:w-1/5 p-5 mb-4 md:mb-0 md:mx-2">
          <div className="flex justify-between w-full">
            <p className="font-montserrat_semi_bold text-text text-lg">
              Montant total
            </p>
            <img src={MontantStat} alt="total" className="h-6 w-6" />
          </div>
          <p className="text-xl text-title font-montserrat_bold">
            {data?.totalPrice} Dt
          </p>
        </div>
        <div className="flex flex-col bg-white rounded-xl justify-between w-full md:w-1/5 p-5 mb-4 md:mb-0 md:mx-2">
          <div className="flex justify-between w-full">
            <p className="font-montserrat_semi_bold text-text text-lg">
              Total en attente
            </p>
            <img src={TotalStat} alt="total" className="h-6 w-6" />
          </div>
          <p className="text-xl text-title font-montserrat_bold">
            {data?.totalPendingOrders}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
