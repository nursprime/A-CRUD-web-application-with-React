import React, { useEffect, useState } from "react";

export function Product() {
    const [content, setContent] = useState(<ProductList showForm={showForm} />);

    function showList() {
        setContent(<ProductList showForm={showForm} />);
    }

    function showForm(product) {
        setContent(<ProductForm product={product} showList={showList} />);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    );
}

function ProductList(props) {
    const [products, setProducts] = useState([]);
    const [completedTasks, setCompletedTasks] = useState({}); // Görevlerin tamamlanma durumunu takip eder

    function fetchProduct() {
        fetch("http://localhost:3008/product")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Beklenmedik server hatası");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched Data:", data);
                setProducts(data);
            })
            .catch((error) => console.log("Bir hata oluştu: ", error));
    }

    useEffect(() => {
        fetchProduct();
    }, []);

    async function deleteProduct(id) {
        try {
            const response = await fetch(`http://localhost:3008/product/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Ürün silinemedi: ${response.statusText}`);
            }

            fetchProduct();
        } catch (error) {
            console.error("Silme işlemi sırasında hata oluştu:", error);
            alert("Silme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        }
    }

    function toggleTaskCompletion(id) {
        setCompletedTasks(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    }

    return (
        <>
            <h2 className="text-center mb-3">Proje Listesi</h2>
            <button onClick={props.showForm} type="button" className="btn btn-success me-2">Yeni Proje</button>
            <button onClick={fetchProduct} type="button" className="btn btn-outline-success me-2">Yenile</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Proje Adı</th>
                        <th>Proje Konusu</th>
                        <th>Oluşturma Tarihi</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.id}</td>
                                <td>{product.projeAdi}</td>
                                <td>{product.projeKonusu}</td>
                                <td>{product.createdAte}</td>
                                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                                    <button onClick={() => props.showForm(product)} type="button" className="btn btn-success btn-sm me-2">Düzenle</button>
                                    <button type="button" className="btn btn-success btn-sm me-2" onClick={() => deleteProduct(product.id)}>Sil</button>
                                    <input type="checkbox" checked={completedTasks[product.id] || false} onChange={() => toggleTaskCompletion(product.id)} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Proje bulunamadı</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

function ProductForm(props) {
    const [errorMessage, setErrorMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const product = Object.fromEntries(formData.entries());

        if (!product.projeAdi || !product.projeKonusu) {
            console.log("Lütfen tüm alanları doldurun");
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Boş alanları lütfen doldurun!
                </div>
            );
            return;
        }

        fetch("http://localhost:3008/product")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Beklenmedik server hatası");
                }
                return response.json();
            })
            .then((data) => {
                const newId = data.length > 0 ? Math.max(...data.map(p => p.id)) + 1 : 1;
                product.id = newId;
                product.createdAte = new Date().toISOString().slice(0, 10);

                fetch("http://localhost:3008/product", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product)
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Beklenmedik server hatası");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Product created:", data);
                        props.showList();
                    })
                    .catch((error) => {
                        console.log("Bir hata oluştu: ", error);
                    });
            })
            .catch((error) => {
                console.log("Bir hata oluştu: ", error);
            });
    }

    return (
        <>
            <h2 className="text-center mb-3">{props.product.id ? "Projeyi Düzenle" : "Yeni Proje Oluştur"}</h2>

            <div className="row">
                <div className="col-lg-6 mx-auto">
                    {errorMessage}
                    <form onSubmit={handleSubmit}>
                        {props.product.id && <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">ID</label>
                            <div className="col-sm-8">
                                <input readOnly className="form-control-plaintext" name="ID" defaultValue={props.product.id} />
                            </div>
                        </div>}
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Proje Adı</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="projeAdi" defaultValue={props.product.projeAdi} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Proje Konusu</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="projeKonusu" defaultValue={props.product.projeKonusu} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Açıklama</label>
                            <div className="col-sm-8">
                                <textarea className="form-control" name="aciklama" defaultValue={props.product.aciklama} />
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="button" onClick={props.showList} className="btn btn-success me-2">İptal</button>
                            <button type="submit" className="btn btn-success">Kaydet</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
