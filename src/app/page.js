import Header from './layouts/header';
import Banner from './layouts/banner';

const Home = () => {
    return (
        <div
            style={{
                transform: `calc(100vw/1920)`,
            }}>
            <Header />
            <Banner />
        </div>
    );
};

export default Home;
