import React, { useEffect, useState } from 'react';
import { Select } from '@shopify/polaris';
import { Button } from '@shopify/polaris';
import { SkeletonBodyText, Loading, Frame } from '@shopify/polaris';


export default function Home(props) {

    const [categories, setCategories] = useState([]);
    const [selectArrays, setSelectArrays] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedObjectArray, setSelectedObjectArray] = useState([]);
    const [attributeSelectArray, setAttributeSelectArray] = useState([]);
    const [selectedAttributesArray, setSelectedAttributesArray] = useState([]);
    const [eachSelectAttributes, setEachSelectAttributes] = useState([]);
    const [skeletonFlag, setSkeletonFlag] = useState(false)

    const [fetchObj, setFetchObj] = useState({
        target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
        selected: [],
        target: {
            marketplace: "amazon",
            shopId: "530"
        },
        user_id: "63329d7f0451c074aa0e15a8"
    })

    const deleteHandler = (event) => {
        var index = (event.currentTarget.id);
        var temp = selectedAttributesArray;

        if (index == (attributeSelectArray.length - 1) && (attributeSelectArray.length != selectedAttributesArray.length)) {
            var tempLast = attributeSelectArray;
            tempLast.splice(index, 1);
            setAttributeSelectArray([...tempLast]);
        }
        else {
            eachSelectAttributes.map((item, index2) => {
                if (temp[index] == item.label) {
                    var tempObj = item;
                    tempObj.disabled = false;
                    var tempArray = eachSelectAttributes;
                    tempArray[index2] = tempObj;
                    setEachSelectAttributes([...tempArray]);
                    var tempArray2 = attributeSelectArray;
                    tempArray2.splice(index, 1);
                    setAttributeSelectArray([...tempArray2]);
                }
            })
            temp.splice(index, 1);
            setSelectedAttributesArray([...temp]);
        }
    }

    const [leafPayload, setLeafPayload] = useState({
        data: {
            barcode_exemption: false,
            browser_node_id: '',
            category: '',
            sub_category: ''
        },
        source: {
            marketplace: 'shopify',
            shopId: '500'
        },
        target: {
            marketplace: 'amazon',
            shopId: '530',
        },
        target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
        user_id: "63329d7f0451c074aa0e15a8"
    });


    var opt = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            appTag: "amazon_sales_channel",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjI5MGRiYjIzOGUyOWExYjIzMzYwY2E5Iiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNjk2NTY4MDE3LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2U1ZjUxYWRkZGFlMjIyNjczN2E5MiJ9.m5LW1XQ_w6E8Y_ZAWV-SqoqLUpgyeQXe3R7aGKhCfkxA0h0i2oESFxS3NXvsqU2zBWO9iPa5vobjXypZCEo7ZbjieaowfryVym-Yc2Kc-SkfHJfr7a2QrXxfKql0nBX0SvgEfVdWKxmVb3AK7MyT60gVUCCh82H7ExXntXA46oTvIQkK2rMTC1pCAFxFcWPTUEvz2yfuyLf62533dDfbdWwnYBxOYXrTUBN9E6aOsbl8MDfglV7bRIiKCXF1hTRjyOzUzqp_Tns4kg3oT2zXKpv7mLFcPpEPnYveRP4TGi_N5gRjfyA4o7xAxTHIxmhlRrY7ZEFUx-BcW6aZz7tYNw`,
            "Ced-Source-Id": 500,
            "Ced-Source-Name": "shopify",
            "Ced-Target-Id": 530,
            "Ced-Target-Name": "amazon"
        },
        body: JSON.stringify({ ...fetchObj })
    }


    var fetchData = async () => {

        // checks if the selected option is a leaf category 
        if (selectedObjectArray[selectedObjectArray.length - 1]?.hasChildren === false) {

            var tempCategory = Object.keys(selectedObjectArray[selectedObjectArray.length - 1].category);
            var tempObj = leafPayload;

            tempObj.data.browser_node_id = selectedObjectArray[selectedObjectArray.length - 1]?.browseNodeId;
            tempObj.data.category = selectedObjectArray[selectedObjectArray.length - 1]?.category[tempCategory[1]];
            tempObj.data.sub_category = selectedObjectArray[selectedObjectArray.length - 1]?.category[tempCategory[0]];

            setLeafPayload({ ...tempObj });
        }
        // if the selected category has further categories 
        else {
            setSkeletonFlag(true);
            var tempArray = [];
            await fetch('https://multi-account.sellernext.com/home/public/connector/profile/getAllCategory/', opt)
                .then(res => res.json())
                .then(temp => {
                    setSkeletonFlag(false);
                    console.log(temp)
                    temp.data.map((item) => {
                        var tempObj = {
                            label: item.name,
                            value: item.name
                        }
                        tempArray.push(tempObj);
                    })
                    setSelectArrays(prevState => [...prevState, tempArray]);
                    setCategories([...temp.data])
                })
        }
    }

    var attributeBtnHandler = (event) => {

        if (attributeSelectArray.length == 0) {
            var leafOpt = {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    appTag: "amazon_sales_channel",
                    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjI5MGRiYjIzOGUyOWExYjIzMzYwY2E5Iiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNjk2NTY4MDE3LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2U1ZjUxYWRkZGFlMjIyNjczN2E5MiJ9.m5LW1XQ_w6E8Y_ZAWV-SqoqLUpgyeQXe3R7aGKhCfkxA0h0i2oESFxS3NXvsqU2zBWO9iPa5vobjXypZCEo7ZbjieaowfryVym-Yc2Kc-SkfHJfr7a2QrXxfKql0nBX0SvgEfVdWKxmVb3AK7MyT60gVUCCh82H7ExXntXA46oTvIQkK2rMTC1pCAFxFcWPTUEvz2yfuyLf62533dDfbdWwnYBxOYXrTUBN9E6aOsbl8MDfglV7bRIiKCXF1hTRjyOzUzqp_Tns4kg3oT2zXKpv7mLFcPpEPnYveRP4TGi_N5gRjfyA4o7xAxTHIxmhlRrY7ZEFUx-BcW6aZz7tYNw`,
                    "Ced-Source-Id": 500,
                    "Ced-Source-Name": "shopify",
                    "Ced-Target-Id": 530,
                    "Ced-Target-Name": "amazon"
                },
                body: JSON.stringify({ ...leafPayload })
            }
            setSkeletonFlag(true);
            var tempArray2 = [];
            fetch('https://multi-account.sellernext.com/home/public/connector/profile/getCategoryAttributes/', leafOpt)
                .then(res => res.json())
                .then(temp => {
                    setSkeletonFlag(false);
                    console.log(temp)
                    for (const mainKey in temp.data) {
                        for (const subKey in temp.data[mainKey]) {
                            var tempObj = {
                                label: temp.data[mainKey][subKey].label,
                                value: temp.data[mainKey][subKey].label,
                                disabled: false
                            }
                            tempArray2.push(tempObj);
                        }
                    }
                    setEachSelectAttributes([...tempArray2]);
                    setAttributeSelectArray(prevState => [...prevState, "1"]);
                })
        }
        else {
            setAttributeSelectArray(prevState => [...prevState, "1"]);
        }


    }

    var handleSelectChange = (value, index) => {
        if (index != (selectArrays.length - 1)) {
            alert('changing middle select tag '+index)
        }
        else {
            if(selectedOptions[index] != null)
            {
                alert("changing last select tag");
            }
            else
            {
                setSelectedOptions(prevState => [...prevState, value])

                // checks the entire category database to get the details of the selected category 
    
                categories.map((item) => {
                    if (item.name === value) {
                        console.log("clicked item")
                        console.log(item)
                        console.log(item.parent_id);
                        setSelectedObjectArray(prevState => [...prevState, item]);
                        var temp = fetchObj;
                        temp.selected = item.parent_id;
                        setFetchObj({ ...temp })
                    }
                })
            }
            
        }
    };

    var handleAttributeChange = (value, index2) => {

        // if something is already selected at that select tag 

        if (selectedAttributesArray[index2] != null) {

            var originalValue = selectedAttributesArray[index2];
            var tempArray2 = selectedAttributesArray;
            tempArray2[index2] = value;
            setSelectedAttributesArray([...tempArray2]);

            // setting disable property to true for the new selected option 
            eachSelectAttributes.map((item, index3) => {
                if (value == item.label) {
                    var temp = item;
                    temp.disabled = true;

                    var tempArray = eachSelectAttributes;
                    tempArray[index3] = temp;

                    setEachSelectAttributes([...tempArray]);

                    // setting disable property to false for the originally selected option
                    eachSelectAttributes.map((i, e) => {
                        if (i.label == originalValue) {
                            var temp2 = i;
                            temp2.disabled = false;

                            var tempArray3 = eachSelectAttributes;
                            tempArray3[e] = temp2;

                            setEachSelectAttributes([...tempArray3])
                        }
                    })
                }
            })
        }

        // if nothing is selected at that select tag 
        else {
            setSelectedAttributesArray(prevState => [...prevState, value]);
            eachSelectAttributes.map((item, index) => {

                if (value == item.label) {
                    var temp = item;
                    temp.disabled = true;

                    var tempArray = eachSelectAttributes;
                    tempArray[index] = temp;

                    setEachSelectAttributes([...tempArray]);
                }
            })
        }
    }





    useEffect(() => {
        fetchData();

    }, [fetchObj])

    return (
        <div className='homeContainer'>
            <div className='categorySelectContainer'>
                {selectArrays.map((item, index) => {
                    return (<>
                        <Select
                            placeholder='Select Any Option'
                            options={selectArrays[index]}
                            onChange={(event) => handleSelectChange(event, index)}
                            value={selectedOptions[index]}
                            key={index}
                        />
                    </>
                    )
                })}
                {(skeletonFlag === true) ? <SkeletonBodyText /> : ''}
            </div>




            <div className='attributeSelectContainer'>
                {(attributeSelectArray.length > 0) ? attributeSelectArray.map((item, index) => {
                    return (
                        <>  <div className='eachAttributeContainer'>
                            <p className='deleteAttributeBtn' id={index} onClick={(event) => deleteHandler(event)}>Delete</p>
                            <div className='eachAttributeSelectDiv'>

                                <Select
                                    label={<p className='labelPara'>Amazon Attribute</p>}
                                    placeholder='Select Any Option'
                                    options={eachSelectAttributes}
                                    onChange={(event) => handleAttributeChange(event, index)}
                                    value={selectedAttributesArray[index]}
                                    key={index}
                                />

                                <Select
                                    label={<p className="labelPara">Shopify Attribute</p>}
                                    placeholder='Select..'
                                    key={index}
                                />

                            </div>
                        </div>
                            {(skeletonFlag === true) ? <SkeletonBodyText /> : ''}
                        </>
                    )
                }) : ''}
            </div>


            {(leafPayload.data.browser_node_id != '') ? <><div className='addBtnDiv'><p className='btnDivText'>Optional Attributes</p>{(attributeSelectArray.length - selectedAttributesArray.length == 1) ? <Button primary onClick={(event) => attributeBtnHandler(event)} disabled={true}>Add Attributes</Button> : <Button primary onClick={(event) => attributeBtnHandler(event)}>Add Attributes</Button>}</div></> : ''}

        </div>
    )
}



