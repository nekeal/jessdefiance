import React from 'react';
import { TopBar, AboutTile } from "../components";
import styled from 'styled-components';
import jess from "../images/jess.jpg";
import { Link } from "react-router-dom";

const Container = styled.div`
  .about {
    margin: 0 auto;
    max-width: min(90%, 1200px);
    display: flex;
    
    @media(max-width: 900px) {
      flex-direction: column;
      align-items: center;
    }
  }
  
  .image {
    width: min(90%, 400px);
    flex-shrink: 0;
    
    img {
      width: 100%;
      border-radius: 1rem;
      box-shadow: 7px 15px 3px 0px #CBB7B0;
    }
  }

  
  .content {
    margin-bottom: 3rem;
  
    .content-top {
      display: flex;  
      align-items: flex-start;
      max-width: min(90%, 900px);
      margin: 0 auto;
      
      @media(max-width: 900px) {
        align-items: center;
        flex-direction: column;
      } 
      
      .text {
        margin-left: 2rem;
        
        @media(max-width: 900px) {
          margin-left: 0;
        } 
      }
    }
    
    .content-bottom {
      max-width: min(90%, 900px);
      margin: 2rem auto;
      
      p {
        margin-bottom: 2rem;
      }
    }
    
    h2 {
      font-family: LemonMilk;
      font-size: 1.3rem;
      margin-top: 0;
      margin-bottom: 1rem;
      
      @media(max-width: 900px) {
        text-align: center;
        margin-top: 1.5rem;
      } 
    }
    
    h3 {
      font-family: LemonMilk;
      font-size: 1rem;
      margin: 1rem 0;
      
      @media(max-width: 900px) {
        text-align: center;
      } 
    }
    
    p {
      margin: 1rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    a {
      color: darkblue;
    }
  }
`;

function About() {
  return (
    <Container>
      <TopBar/>
      <div className="about">
        <div className="content">
          <div className="content-top">
            <div className="image"><img src={jess} alt=""/></div>
            <div className="text">
              <h2>O mnie</h2>
              <p>Hola, bonjour, ciao, halo, hello, cześć.</p>
              <p>
                Z tej strony Jess. Studiuję, jestem kompletnym freakiem ESNu i kocham ludzi, którzy z tą wspaniałą organizacją się łączą i ludzi generalnie, każdą wolną chwilę staram się poświęcać na odkrywanie nowych miejsc i poznawanie ciekawych kultur oraz osobowości, a do tego uwielbiam modę, a bloga tego postanowiłam założyć już naprawdę dawno temu.
              </p>
            </div>
          </div>
          <div className="content-bottom">
            <h3>
              Dlaczego?
            </h3>
            <p>
              Ponieważ sama czegoś takiego szukałam przez bardzo długi czas i niestety nie znalazłam. Ostatnio zaczynają pojawiać się podobne jak to miejsca, ale wciąż jest ich jeszcze mało i bardzo rzadko okazują się wartościowe merytorycznie.
              Moim marzeniem przez bardzo długi czas było skończenie medycyny i zostanie lekarzem. Chciałam robić coś ważnego i przede wszystkim - coś dla ludzi. Jak wszyscy dobrze wiemy życie szybko samo weryfikuje niektóre nasze plany i ten w moim przypadku okazał się fiaskiem. Nie wiem czy to dobrze, ale nie o tym będę pisała.
              Alternatywą dla tych ciężkich studiów i wcale niełatwego życia później miał być dla mnie ten blog. I oto jestem. Trzy lata zajęło mi obmyślenie planu działania, zdobycie odpowiedniej ilości wiedzy, niewykończenie wspaniałych ludzi, którzy postanowili mi pomóc i napisanie czegoś, co będzie miało wartość.
            </p>
            <h3>
              O czym będziecie mogli tutaj przeczytać?
            </h3>
            <p>
              Najwięcej prawdopodobnie o modzie, ale nie tylko tej wysokiej w kwestii trendów, ale też tej bardzo basic. Postaram się w najbardziej rzetelny (jak tylko potrafię) sposób przekazać Wam wiedzę, którą udało mi się zdobyć w trakcie różnych kursów i po prostu wszystkich tych lat, podczas których szeroko pojęta moda stała się moją pasją. Do tego od czasu do czasu będę dzieliła się z Wami ważnymi dla mnie przemyśleniami i historiami.
              Nie będę pisała Wam o tym, co macie nosić. Przedstawię Wam dwa spojrzenia - to bardzo podstawowe, od którego mocno się w tym momencie odchodzi i to zahaczające o high fashion. To, co Wy z tego wyciągniecie, będzie zależało tylko i wyłącznie od Was. Ja postaram się w krytyczny sposób podejść do tego, z czym osobiście się nie zgadzam, ale też w maksymalnie profesjonalny sposób opowiedzieć Wam dlaczego tak jest. Będę się starała szeroko opowiedzieć Wam o tym, co wiem, przemycając gdzieś po drodze moje subiektywne spojrzenie na niektóre sprawy, ale w taki sposób, żebyście to Wy mogli zadecydować jakie kroki jesteście gotowi podjąć i jakie ma to wszystko dla Was znaczenie. Choć mam nadzieję, że do tych podstaw podejdziecie z dystansem i będziecie chcieli skupić się na tym, co w modzie naprawdę ważne, czyli wyrażaniu siebie (a jeśli będzie to szło w parze z trendami to już kosmos). Ale wiadomo — nic na siłę. Przecież mamy czas.
            </p>
            <h3>
              Who am I to write?
            </h3>
            <p>
              To jest właśnie pytanie, na które jeszcze dwa lata temu nie byłabym w stanie odpowiedzieć. Ale dziś śmiało mogę. Oprócz ogólnej wiedzy, która niespecjalnie dawała mi odwagę do działania, ukończyłam dwa kursy stylizacji w Akademii Stylu w Krakowie i co chyba najważniejsze, wciąż poszerzam swoją wiedzę i się rozwijam, a do tego jestem aktywna zawodowo w tej dziedzinie, więc z pełną odpowiedzialnością mogę powiedzieć, że jestem stylistką mody.
              I ta część mojego doświadczenia będzie odpowiadała za to, co podstawowe, co też w pewien sposób właściwe i trochę łatwiejsze, ale z czym niezupełnie w głębi serduszka się zgadzam.
              Za tę drugą część będzie odpowiadało to, co czuję, co lubię, czego chcę, co zaobserwuję, i co zrozumiem z tego, co będzie się działo w świecie mody.
              I do tworzenia tej części odwagi dodała mi najlepsza stylistka mody, którą kiedykolwiek miałam szansę obserwować - Karolina Domaradzka.
              Nie wiem jeszcze o modzie tyle ile ona, ale ponieważ jestem zupełnie inną osobą, z delikatnie mniej krytycznym spojrzeniem na to, co nas otacza (też na pewno za sprawą mniejszego doświadczenia), ale myślę, że wiem na tyle dużo, by móc się tym z Wami dzielić.
            </p>
            <p>
              Będę pisała dla każdej i każdego z Was. Bo rozmiar czy wzrost to tylko liczby, (kolor skóry to tylko kwestia genów i melaniny, itd.), a w sztuce, jaką jest dla mnie moda, o nie chodzi najmniej. I choć faktycznie żeby się w coś ubrać musimy sięgnąć po część garderoby w danym rozmiarze, to proszę, pamiętajmy cały czas, że to tylko ubranie. I choć ma ono tę magiczną moc, że możemy dzięki niemu czuć się pewniej, atrakcyjniej i piękniej, to wciąż pozostanie tylko ubraniem.
            </p>
            <p>
              I to będę starała się Wam pokazać. Różnymi sposobami. Będę się starała, żebyśmy przestali być szarymi małymi ludźmi, a zaczęli przez to, jak wyglądamy, mówić o tym, kim jesteśmy i w pełni to akceptować. Choć jasne, że w byciu małym, szarym człowieczkiem chodzącym tylko w tym, co lubi, (bądź co akurat jest czyste xDˣᴰ) też jest okay. Nie każdy będzie modę lubił i chciał się w tym kierunku rozwijać, i to też jest absolutnie i totalnie w porządku.
            </p>
            <p>
              Jednak nie byłoby mnie tutaj bez wielu cudownych osób.
              Mogłabym tu wymieniać dziesiątki z nich, bo naprawdę dziesiątki się przyczyniły do tego, że tutaj jestem, ale w tym miejscu na szczególne wyróżnienie zasłużyła trójka.
              Olga Then, Szymon Cader i Kamil Krzempek.
              Jakieś 3 lata temu, kiedy pomysł założenia bloga rodził się w mojej głowie, to ta Wielka Trójka zadeklarowała mi swoją pomoc. I nie uwierzycie, ale nie dość, że wytrzymali ze mną tyle czasu, to jeszcze dzięki nim udało nam się to sfinalizować.
              Za zaprojektowanie szaty graficznej oraz user experience odpowiada Olga, a dziełem chłopaków jest strona od strony technicznej i wizualnej.
              To prawdziwi mistrzowie tej trudnej sztuki, a do tego naprawdę cudowni młodzi ludzie, więc z całego serca mogę polecić pracę z nimi.
              (No i nauczyli takiego antyITowca jak ja czym różni się domena od hostingu, więc halo, są genialni.)
            </p>
            <p>
              Ponieważ oprócz bloga jestem też aktywna zawodowo, to śmiało możesz się do mnie zwrócić w sprawie personal shoppingu, zakupów online, przeglądu szafy czy z jakąkolwiek sprawą wymagającą Twoim zdaniem pomocy stylisty.
              Pracuję zarówno z kobietami i mężczyznami.
              Wszystkie dane kontaktowe znajdziesz w zakładce <Link to="/contact">KONTAKT</Link>.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default About;
