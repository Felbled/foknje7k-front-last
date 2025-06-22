import React, { useEffect, useState } from "react";
import { Pocket } from "../../../assets/svg";
import { Mission } from "../../../assets/images";
import CustomTable from "../../../shared/custom-table/custom-table";
import {
  columnsRequestsCurrentStudent,
  columnsRequestsCurrentTeacher,
} from "../../../mocks/fakeData";
import { getAllStudentCurrentRequests } from "../../../services/student-offer";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { getCurrentTeacherRequests } from "../../../services/teacher-offer";

const Subscription = () => {
  const role = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (role === "ROLE_STUDENT") {
      getAllStudentCurrentRequests()
        .then((res) => {

          res.data = res.data.map((item: any) => {
            return {
              ...item,
              endDate: item.status === "PENDING" ? "N/A" : item.endDate,
            };
          });

          setData(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      getCurrentTeacherRequests()
        .then((res) => {
          console.log(res);
          setData(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [role]);

  const ActionButtons: React.FC<{ row: any }> = ({ row }) => {
    // Get today's date without time for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Check if endDate is a valid date
    const isValidDate = row.endDate && !isNaN(new Date(row.endDate).getTime());
    const endDate = isValidDate ? new Date(row.endDate) : null;
    console.log(endDate);
    console.log(today);
    return (
      <div className="flex items-center justify-center space-x-2">
        {endDate && (endDate < today && row.status === 'ACCEPTED') ? (
          <p className="cursor-pointer bg-[#808080] text-white font-montserrat_regular rounded-full px-5 ms-1">
            Expirée
          </p>
        ) : row.status === "ACCEPTED" ? (
          <p className="cursor-pointer bg-primary_bg text-white font-montserrat_regular rounded-full px-5">
            Acceptée
          </p>
        ) : row.status === "REJECTED" ? (
          <p className="cursor-pointer bg-red text-white font-montserrat_regular rounded-full px-5 ms-1">
            Rejetée
          </p>
        ) : (
          <p className="cursor-pointer bg-text text-white font-montserrat_regular rounded-full px-5 ms-1">
            Pending
          </p>
        )}
      </div>
    );
  };
  

  const renderActions = (row: any) => <ActionButtons row={row} />;

  return (
    <div className="w-full p-3">
      <p className="text-3xl text-title font-montserrat_bold mb-10">
        Abonnement
      </p>
      <div className="flex flex-col md:flex-row items-center justify-around px-5 md:px-10 mb-10">
        <div className="bg-white flex flex-col items-center p-5 rounded-3xl w-full md:w-2/5 mb-5 md:mb-0">
          <p className="text-2xl text-title font-montserrat_semi_bold mb-10 mt-3">
            Votre solde Actuel
          </p>
          <div className="flex items-center justify-between w-10/12">
            <p className="text-red font-montserrat_semi_bold text-lg">
              0 Points
            </p>
            <img src={Pocket} alt={"image-pocket"} className={"w-32 h-32"} />
          </div>
          <div className="w-10/12 border-primary border-2 rounded-lg p-2 my-2">
            <p className="text-text font-montserrat_medium text-sm">
              Banque BNA
            </p>
            <p className="text-text font-montserrat_medium text-sm">
              Compte : Omar Riahi
            </p>
            <p className="text-text font-montserrat_medium text-sm">
              RIB : 03 200 012 0112 000 266 51
            </p>
          </div>
          <div className="w-10/12 border-primary border-2 rounded-lg p-2 my-2">
            <p className="text-text font-montserrat_medium text-sm">
              La Poste Tunisienne
            </p>
            <p className="text-text font-montserrat_medium text-sm">
              Compte : Riahi Omar
            </p>
            <p className="text-text font-montserrat_medium text-sm">
              D17 : 4742 0140 4391 9147
            </p>
          </div>
          <div className="w-10/12 border-primary border-2 rounded-lg p-2 my-2">
            <p className="text-text font-montserrat_medium text-sm">
              La Poste Tunisienne
            </p>
            <p className="text-text font-montserrat_medium text-sm">
              Compte : Riahi Omar
            </p>
            <p className="text-text font-montserrat_medium text-sm">
              RIB : 17 002000000 3493 484 56
            </p>
          </div>
        </div>
        <div
          className="bg-white flex flex-col justify-center pt-28 px-5 lg:pt-5 md:px-10 rounded-3xl w-full md:w-2/5 h-[60vh] overflow-y-scroll mb-5 md:mb-0"
          style={{
            backgroundImage: `url(${Mission})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <h1 className="text-white font-montserrat_semi_bold text-2xl mb-5">
            Notre Mission
          </h1>
          <p className="text-white font-montserrat_regular text-lg leading-10">
            Apprenez en ligne comme si vous y étiez ! Des cours en direct avec
            vidéo et audio haute qualité pour une expérience immersive et
            interactive. Engagement accru, meilleure rétention et accessibilité
            pour tous.
          </p>
        </div>
      </div>
      <CustomTable
        title="Liste des Abonnement"
        columns={
          role === "ROLE_STUDENT"
            ? columnsRequestsCurrentStudent
            : columnsRequestsCurrentTeacher
        }
        data={data}
        actions={renderActions}
      />
      <div className={"h-10"}></div>
    </div>
  );
};

export default Subscription;
