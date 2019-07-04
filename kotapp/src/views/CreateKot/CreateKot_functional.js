import React, { useState, useEffect, useRef } from "react";
import fire from "../../config/fire";
import uuid from "uuid";

import "./Create_kot.css";

const CreateKot = props => {
  // UseState
  const min = 1000;
  const max = 9999;

  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [number] = useState(
    String(Math.round(min + Math.random() * (max - min)))
  );

  const latestName = useRef(name);

  useEffect(() => {
    //component did mount logic

    return () => {
      //component did unmount
    };
  }, []);

  useEffect(() => {
    latestName.current = name;
  }, [name]);

  // const functions
  const createKot = e => {
    e.preventDefault();
    if (name && postalCode && street) {
      fire
        .firestore()
        .collection("/Koten")
        .add({
          Name: name,
          City: postalCode,
          Street: street,
          Number: number,
          Uuid: uuid.v4()
        })
        .then(result => {
          console.log(result);
          console.log("Data sent:", name, postalCode, street, number);
        });
    }
  };

  // data management

  // render
  return (
    <div>
      <form>
        <h1>Sign Up</h1>
        <input
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          name="name"
          className="form-control"
          placeholder="Enter name kot"
        />
        <input
          value={postalCode}
          onChange={e => {
            setPostalCode(e.target.value);
          }}
          type="number"
          name="postalCode"
          className="form-control"
          placeholder="Enter postalCode"
        />
        <input
          value={street}
          onChange={e => {
            setStreet(e.target.value);
          }}
          type="name"
          name="street"
          className="form-control"
          placeholder="Enter street + nr"
        />
        <button onClick={createKot} className="btn btn-signup">
          Register Kot
        </button>
      </form>
    </div>
  );
};

export default CreateKot;
