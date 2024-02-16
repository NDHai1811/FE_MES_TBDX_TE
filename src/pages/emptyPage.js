import image from "../assets/images/403.jpg";

const EmptyPage = () => {
    return (<img src={image} style={{objectFit: 'cover', height: '100vh', width: '100vw'}}/>);
}
export default EmptyPage;