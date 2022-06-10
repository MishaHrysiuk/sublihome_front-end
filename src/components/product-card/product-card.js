import { Card, Button } from "react-bootstrap"
import Bg from '../../resources/img/Background.png';
import './product-card.scss'

const ProductCard = (props) => {
    const picture = props.picture ? `data:image/png;base64,${props.picture}` : `${Bg}`;
    return (
        <Card style={{ width: '18rem', margin: 5, border: '2px solid #162e44' }}>
            <Card.Img variant="top" src={picture}/>
            <Card.Body className="card__body">
                <div>
                    <Card.Title>{props.name}</Card.Title>
                    <Card.Text>{props.price} ₴</Card.Text>
                </div>
                <Button disabled={props.disabled} onClick={() => props.onAddProductToCart(props.id)} className="card__button" variant={props.disabled ? "success" : "primary"}>{props.disabled ? "Добавлено" : "В корзину"}</Button>
            </Card.Body>
        </Card>
    )
}

export default ProductCard