import axios from "axios";
import DefaultsAxios from "../../helpers/jwt-interceptor";

import ProductCard from "../product-card/product-card";
import { useEffect, useState, useRef } from "react";
import { Card, Spinner, Form, Row, Col, Pagination } from "react-bootstrap";
import { ProductService, ProductTypeService, CartService } from "../../services/sublihome-service";
import { authenticationService } from "../../services/auth-service";


const ProductsPage = () => {
    const productService = new ProductService(axios.defaults.baseURL, DefaultsAxios);
    const productTypeService = new ProductTypeService(axios.defaults.baseURL, DefaultsAxios);
    const cartService = new CartService(axios.defaults.baseURL, DefaultsAxios);
    const currentUserId = authenticationService.currentUserId;

    const [idList, setIdList] = useState([]);
    const [countList, setCountList] = useState([]);
    const [cartList, setCartList] = useState([]);
    const idListRef = useRef();
    idListRef.current = idList;
    const countListRef = useRef();
    countListRef.current = countList;
    const cartListRef = useRef();
    cartListRef.current = cartList;

    const [productList, setProductList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [maxPrice, setMaxPrice] = useState(500);
    const [type, setType] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [countElemOnPage, setCountElemOnPage] = useState(4);



    useEffect(() => {
        onRequest();
        return (() => {
            onSendRequest();
        })
    }, [])

    const onRequest = async() => {
        await productService.getAllProducts()
            .then(onProductListLoaded)
            .catch(err => {
                setLoading(false);
                alert(err.response.message ? err.response.message : err.status);
            })
        await productTypeService.getAllProductTypes()
            .then(res => setTypeList(res))
            .catch(err => {
                setLoading(false);
                alert(err.status)
            })
        await cartService.getItemsFromCart(currentUserId)
            .then(onCartListLoaded)
            .catch(err => alert(err.response.message ? err.response.message : err.status))
    }

    const onSendRequest = async () => {
        const idList = cartListRef.current.map(item => item.productId);
        const countList = cartListRef.current.map(item => item.count);
        if (JSON.stringify(idList) !== JSON.stringify(idListRef.current) ||
            JSON.stringify(countList) !== JSON.stringify(countListRef.current)) {
            await cartService.updateCart({
                userId: currentUserId,
                productsList: idListRef.current,
                productsCount: countListRef.current
            })
                .then(res => console.log('updateCart'))
                .catch(err => alert(err.response.message ? err.response.message : err.status))
        }
    }

    const onProductListLoaded = (list) => {
        setProductList(list)
        setLoading(false);
    }

    const onCartListLoaded = (list) => {
        const idList = list.map(item => item.productId);
        const countList = list.map(item => item.count);
        setIdList(idList)
        setCountList(countList)
        setCartList(list)
    }

    const onAddProductToCart = (id) => {
        if (!idList.includes(id)) {
            setIdList(idList => [...idList, id])
            setCountList(countList => [...countList, 1])
        }
    }

    function getCards(arr) {
        const startElem = currentPage * countElemOnPage - countElemOnPage;
        const endElem = currentPage * countElemOnPage;
        return arr.slice(startElem, endElem).map((item) => {
            return (
                <ProductCard
                    key={item.id}
                    name={item.name}
                    id={item.id}
                    price={item.price}
                    picture={item.productPicture ? item.productPicture.fileContents : null}
                    onAddProductToCart={onAddProductToCart}
                    disabled={idList.includes(item.id)}/>
            )
        })
    }

    const getOptionList = (arr) => {
        return arr.map((item) => {
            return (
                <option key={item.id} value={item.id}>{item.name}</option>
            )
        })
    }

    //filetrfunction
    const searchProduct = (items, term) => {
        if (term.length === 0) {
            return items;
        }
        return items.filter(item => (item.name
                    .toLowerCase()
                    .indexOf(term.toLowerCase()) > -1))
    }

    const maxPriceProduct = (items, term) => {
        return items.filter(item => (+item.price) < (+term))
    }

    const typeProduct = (items, term) => {
        if (term.length === 0) {
            return items;
        }
        return items.filter(item => (+item.productType.id) === (+term))
    }

    //pagging
    const nextPage = (list) => {
        if (currentPage + 1 <= Math.ceil(list.length / countElemOnPage)) {
            setCurrentPage(currentPage => currentPage + 1)
        }
    }

    const prevPage = () => {
        if (currentPage - 1 > 0) {
            setCurrentPage(currentPage => currentPage - 1)
        }
    }

    const firstPage = () => {
        setCurrentPage(1)
    }

    const lastPage = (list) => {
        if (Math.ceil(list.length / countElemOnPage) !== 0) {
            setCurrentPage(Math.ceil(list.length / countElemOnPage))
        }
    }
    
    const visibleData = typeProduct(maxPriceProduct(searchProduct(productList, search), maxPrice), type);
    const items = getCards(visibleData);
    const notFound = (!visibleData.length && !loading) ? <h1>Товари не знайдено :(</h1> : null;  
    const spinner = loading ? <Spinner animation="border" variant="info" /> : null;
    const content = !loading ? items : null;

    return (
        <div className="block">
            <div className="container">
                <div className="block__title title">Наші товари</div>
                <Card className="mb-3">
                    <Card.Body>
                    <Form>
                            <Row>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label>Пошук по назві</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Введіть що ви шукаєте"
                                        value={search}
                                        onChange={(e) => { setCurrentPage(1); setSearch(e.target.value)}}/>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label>Тип товару</Form.Label>
                                    <Form.Select
                                        onChange={(e) => { setCurrentPage(1); setType(e.target.value)}}
                                        value={type}>
                                        <option value="">Всі</option>
                                        {getOptionList(typeList)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label>Границя ціни</Form.Label>
                                    <Form.Range
                                        value={maxPrice}
                                        min={0}
                                        max={500}
                                        onChange={(e) =>  { setCurrentPage(1); setMaxPrice(e.target.value)}}/>
                                    <div>Гранична ціна: {maxPrice} ₴</div>
                                </Form.Group>
                        </Row>
                        </Form>
                    </Card.Body>
                </Card>
                <Pagination style={{justifyContent: 'center'}}>
                    <Pagination.First onClick={firstPage}/>
                    <Pagination.Prev onClick={prevPage}/>
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => nextPage(visibleData)}/>
                    <Pagination.Last onClick={() => lastPage(visibleData)}/>
                </Pagination>
                <div className="block__row">
                    {spinner}
                    {content}
                    {notFound}
                </div>
                <Pagination className="mt-3" style={{justifyContent: 'center'}}>
                    <Pagination.First onClick={firstPage}/>
                    <Pagination.Prev onClick={prevPage}/>
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => nextPage(visibleData)}/>
                    <Pagination.Last onClick={() => lastPage(visibleData)}/>
                </Pagination>
            </div>
        </div>
    )
}

export default ProductsPage