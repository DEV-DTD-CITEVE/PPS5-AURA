import CompartmentDetails from "./compartmentDetails.jsx";
import "./compartment.css";

const Compartment = ({
  compartments = [
    { name: "compartment_A", piece_type: "Basic_Black", piece_count: 12, max_pieces: 20 },
{ name: "compartment_B", piece_type: "Basic_Black", piece_count: 20, max_pieces: 20 },
{ name: "compartment_C", piece_type: "None_inherent", piece_count: 9, max_pieces: 20 },
  ],
  isEditing = false,
  onCompartmentChange = () => {},
}) => {
  return (
    <section className="compartment-list" aria-label="Compartment list">
      <div className="compartment-list-inner">
        {compartments.map((c, index) => (
          <CompartmentDetails 
            key={c.name} 
            {...c} 
            isEditing={isEditing}
            onItemsChange={(value) => onCompartmentChange(index, 'piece_count', value)}
          />
        ))}
      </div>
    </section>
  );
};

export default Compartment;