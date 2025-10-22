import { createRow } from "../classes/row";
import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import '../Calculator.css';


const Calculator = () => {
    const INITIAL_ROWS = 3;
    const [rows, setRows] = useState(Array.from({ length: INITIAL_ROWS }, () => createRow()));
    const [showCalculator, setShowCalculator] = useState(false);
    const [logoBounce, setLogoBounce] = useState(true); 
    const [logoFlip, setLogoFlip] = useState(false); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCalculator(true);
            setLogoBounce(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleLogoClick = () => {
        setLogoFlip(true);
        setTimeout(() => setLogoFlip(false), 1000);
    };


    const addRow = () => {
        setRows([...rows, createRow()]);
    };
    const removeRow = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const toggleRow = (id) => {
        setRows(
            rows.map((row) =>
            row.id === id ? { ...row, enabled: !row.enabled } : row
            )
        );
    };
    const updateRow = (id, key, value) => {
        setRows(
        rows.map((row) =>
            row.id === id ? { ...row, [key]: value } : row
            )
        );
    };

    const calculateResult = () => {
        return rows.reduce((acc, row) => {
            if (!row.enabled) return acc;
            return row.sign === "+" ? acc + Number(row.value) : acc - Number(row.value);
        }, 0);
    };

    return (
        <Container fluid className="d-flex flex-column align-items-center justify-content-center min-vh-100">
             <img
                src="/images/logo.png"
                alt="Calculator Title"
                className={`calculator-title mb-4 animate__animated 
                    ${logoBounce ? "animate__bounceInDown" : ""} 
                    ${logoFlip ? "animate__flip" : ""}`}
                onClick={handleLogoClick}
            />
            {showCalculator && (
                <div className="calculator animate__animated animate__fadeInUp">
                    {rows.map((row) => (
                        <Row
                            key={row.id}
                            className={`align-items-center mb-2 ${!row.enabled ? "opacity-50" : ""}`}
                        >
                            <Col xs="auto">
                                <Form>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label={row.enabled ? "Enabled" : "Disabled"}
                                        checked={row.enabled}
                                        onChange={() => toggleRow(row.id)}
                                    />
                                </Form>
                            </Col>

                            <Col xs="auto">
                                <Form.Select
                                    className="sign-select"
                                    value={row.sign}
                                    onChange={(e) => updateRow(row.id, "sign", e.target.value)}
                                >
                                    <option value="+">+</option>
                                    <option value="-">-</option>
                                </Form.Select>
                            </Col>

                            <Col>
                                <Form.Control
                                    type="text"
                                    value={row.value}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^[0-9]+$/.test(val)) { 
                                        updateRow(row.id, 'value', val);
                                        }
                                    }}
                                    isInvalid={row.value < 0}
                                    min="0"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Value must be a positive number
                                </Form.Control.Feedback>

                            </Col>

                            <Col xs="auto" className="ms-0 me-3 p-0">
                                <Button variant="danger" onClick={() => removeRow(row.id)}>
                                    <i className="bi bi-x-lg"></i>
                                </Button>
                            </Col>
                        </Row>
                    ))}

                    <Row className="mt-3">
                        <Col>
                            <Button  onClick={addRow} className="button_attr">
                                Add Row
                            </Button>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                        <h5 className="text-center">Result: {calculateResult()}</h5>
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
}
export default Calculator;
