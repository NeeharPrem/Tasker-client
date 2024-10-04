import Calendar from "../components/common/Calender";
import Header from "../components/common/Header";

const Home = () => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Calendar />
            </div>
        </div>
    );
};

export default Home;