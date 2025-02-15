interface TeamCardProps {
  name: string;
  position: string;
  description: string;
  image: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, position, description, image }) => {
  return (
    <div className="max-w-lg sm:max-w-sm text-textlight dark:text-textdark">
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <div className="p-4 text-center">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{position}</p>
        <p className="text-sm mt-2">{description}</p>
      </div>
    </div>
  );
};

export default TeamCard;
