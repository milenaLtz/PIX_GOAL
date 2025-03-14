import { Link, useNavigate } from 'react-router-dom';
import Header from '../widgets/header';
import UserInfoBlock from '../widgets/userInfoBlock';
import IntroductionBlock from '../widgets/introductionBlock';
import UserGoalsBlock from '../widgets/userGoalsBlock';
import Footer from '../widgets/footer';


const HomePage = () => {

  localStorage.removeItem('pixels')
    return(
        <>
          <Header/>
          <main className='main-page'>
              <IntroductionBlock page="home" greetings="Добрый день, User" description="Достигай свои цели здесь и сейчас!"/>
              <UserInfoBlock/>
              <UserGoalsBlock/>
          </main>
          <Footer/>
        </>
    )
}
export default HomePage;
