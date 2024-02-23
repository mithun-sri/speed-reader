import AnalyticsMode from "./AnalyticsMode";
import AdminStatisticsComp from "./AdminStatistics";

interface AdminAnalyticsBoxProps {
  option: string;
  handleClick: (option: string) => void;
  avgWpm: number;
  score: number;
  min_wpm: number;
  max_wpm: number;
}

const AdminAnalyticsBox: React.FC<AdminAnalyticsBoxProps> = ({
  option,
  handleClick,
  avgWpm,
  score,
  min_wpm,
  max_wpm,
}) => {
  return (
    <>
      <AnalyticsMode selectedOption={option} handleOptionClick={handleClick} />
      <AdminStatisticsComp
        score={score}
        avgWpm={avgWpm}
        low={min_wpm}
        high={max_wpm}
      />
    </>
  );
};

export default AdminAnalyticsBox;
