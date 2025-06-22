import React, { useState, useContext } from "react";
import {  one, three, four, two, five , six } from "../../../assets/images";
import CustomButton from "../../../shared/custom-button/custom-button";
import { SnackbarContext } from "../../../config/hooks/use-toast";
interface ContentItem {
  id: string;
  label: string;
  content: Array<{
    title: string;
    description: string;
    image?: string; // Optional local image
  }>;
}

const contents: ContentItem[] = [
  {
    "id": "primaire",
    "label": "Primaire",
    "content": [
      {
        title: "Matières Primaire - Année 1",
        "description": "Première année, centrée sur les compétences de base en lecture et en mathématiques.",
        image: one
      },
      {
        title: "Matières primaire - Année 2",
        description: "Deuxième année, développement de la lecture, de l'écriture et des premières notions de sciences.",
        image: two
      },
      {
        title: "Matières Primaire - Année 3",
        description: "Troisième année, approfondissement de l'histoire, des langues et de la pensée critique.",
        image: three
      },
      {
        title: "Matières Primaire - Année 4",
        description: "Quatrième année, perfectionnement des compétences et introduction à des sujets plus complexes.",
        image: four
      },
      {
        title: "Matières Primaire - Année 5",
        description: "Cinquième année, préparation à la transition vers le collège avec des matières plus avancées.",
        image: five
      },
      {
        title: "Matières Primaire - Année 6",
        description: "Sixième année, préparation aux examens finaux et révision des matières essentielles.",
        image: six
      }
    ]
  },
  {
    "id": "college",
    "label": "Collège",
    "content": [
      {
        title: "Cours Collège - Année 1",
        description: "Septième année, 'Première', introduction aux matières principales et à la pensée critique.",
        image : one
      },
      {
        title: "Cours Collège - Année 2",
        description: "Huitième année, 'Deuxième', approfondissement des connaissances en sciences, langues et mathématiques.",
        image: two
      },
      {
        title: "Cours Collège - Année 3",
        description: "Neuvième année, 'Troisième', préparation à la transition vers le lycée avec des sujets plus complexes.",
        image: three
      }
    ]
  },
  {
    "id": "lycee",
    "label": "Lycée",
    "content": [
      {
        title: "Curriculum Lycée - Année 1",
        description: "Première année secondaire, 'Première', introduction aux matières spécialisées et aux choix de parcours.",
        image: one
      },
      {
        title: "Curriculum Lycée - Année 2",
        description: "Deuxième année secondaire, 'Deuxième', approfondissement des connaissances et développement des compétences analytiques.",
        image : two
      },
      {
        title: "Curriculum Lycée - Année 3",
        description: "Troisième année secondaire, 'Troisième', préparation aux examens finaux et révision des matières essentielles.",
        image: three
      },
      {
        title: "Curriculum Lycée - Année 4",
        description: "Quatrième année secondaire, 'Baccalauréat', ultime préparation pour les examens de fin d'études et la transition vers l'université.",
        image: four
      }
    ]
  }
  ,
];

const Classes = () => {
  const [activeTab, setActiveTab] = useState<string>(contents[0].id);
  const snackBar = useContext(SnackbarContext);
  const renderContent = () => {
    const activeContent = contents.find(
      (item) => item.id === activeTab,
    )?.content;

    return (
      <div
        id="free-courses"
        className="w-screen flex md:flex-row flex-col  justify-center flex-wrap gap-6  px-4 md:px-10 lg:px-24 mt-6"
      >
        {activeContent?.map((item, index) => (
          <div
            key={index}
            className="mb-4 bg-white w-full sm:w-2/5 md:w-1/4 lg:w-1/5 h-96 flex flex-col justify-around items-center rounded-2xl shadow-lg"
          >
            <div className="text-center flex flex-col items-center">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="my-3 w-14 h-14 object-cover"
                />
              )}
              <h3 className="font-montserrat_medium text-lg font-bold">
                {item.title}
              </h3>
            </div>
            <p className="font-montserrat_regular text-text w-5/6 text-center">
              {item.description}
            </p>
            <CustomButton
              text={"Détails du cours"}
              width={"w-min"}
              className="bg-white border border-primary text-primary rounded-md hover:bg-primary hover:text-white text-nowrap"
              onClick={() => snackBar?.showMessage("Détails du cours","Veuillez vous authentifier pour accéder aux détails du cours.", "info")}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-blue-500  py-14">
      <h1 className="text-title text-3xl md:text-4xl lg:text-6xl font-montserrat_medium mb-3 text-center">
        Cours qualifiés pour les élèves
      </h1>
      <p className="font-montserrat_regular text-text mb-7 w-4/5 md:w-2/5 text-center">
        Les cours qualifiés pour les élèves peuvent être une excellente option
        pour acquérir des compétences rapidement.
      </p>
      <div className="flex items-center lg:flex-row flex-col lg:space-x-4 mb-4 space-y-4 lg:space-y-0 ">
        {contents.map((item) => (
          <CustomButton
            key={item.id}
            text={item.label}
            onClick={() => setActiveTab(item.id)}
            className={
              activeTab === item.id
                ? "bg-backgroundHome"
                : "bg-white text-title"
            }
          />
        ))}
      </div>
      <div className="mb-10">{renderContent()}</div>
      <CustomButton 
        text={"Visitez des cours"} 
        onClick={() => snackBar?.showMessage("Détails du cours","Veuillez vous authentifier pour accéder aux détails du cours.", "info")}
        />
    </div>
  );
};

export default Classes;
