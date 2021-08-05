import "./App.css";

// BelowRequired
import { Checkbox, Button, Modal, Input, Select, Divider, Table } from "antd";
import { useState } from "react";
import _ from "lodash";
const { Option } = Select;

const OptionInputs = ({
  options,
  multiSelect,
  showRemove,
  handleRemoveClick,
  OptionType,
  selectedOption,
}) => {
  return options && multiSelect ? (
    <div className="pt-1">
      <div className="leading-loose flex justify-between">
        <div className="font-semibold">
          Option {options.OptionNumber || "1"}
        </div>
        {showRemove && (
          <div
            className="font-normal text-primary-color underline cursor-pointer"
            onClick={handleRemoveClick}
          >
            Remove
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="">
          <Select
            placeholder={options.OptionPlaceholder || "Please Select"}
            defaultValue={
              options.OptionDefaultValue ? options.OptionDefaultValue : null
            }
            value={options.OptionValue || []}
            onChange={(value, option) => {
              if (options.handleOptionNameInput) {
                options.handleOptionNameInput(value, option);
              }
            }}
            className="w-full"
          >
            {OptionType.map((val) => {
              return (
                <Option key={val.value} value={val.value}>
                  {val.name}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="w-full col-span-2">
          <Select
            mode="tags"
            placeholder={multiSelect.multiSelectPlaceholder || "Please Select"}
            defaultValue={multiSelect.multiSelectDefaultValue || []}
            value={multiSelect.multiSelectValue || []}
            onChange={(value, option) => {
              if (multiSelect.handleOptionMultiSelectInput) {
                multiSelect.handleOptionMultiSelectInput(value, option);
              }
            }}
            onInputKeyDown={(e) => {
              if (e.code === "Tab") {
              }
            }}
            optionFilterProp="label"
            className="w-full"
          ></Select>
        </div>
      </div>
    </div>
  ) : null;
};

function App() {
  const [dataSource, setDataSource] = useState([]);
  const [allowVariants, setAllowVariants] = useState(false);
  const [addVariants, setAddVariants] = useState(false);
  const [Options, setOptions] = useState([
    { optionName: "size", values: ["a10", "b20"], key: 1 },
  ]);
  const showModal = () => {
    setAddVariants(true);
  };
  const handleOk = () => {
    setAddVariants(false);
  };

  const handleCancel = () => {
    setAddVariants(false);
  };
  const handleRemoveClick = (op) => {
    let tempData = Options.filter((aa) => aa.key !== op.key).map((bb, i) => {
      return { ...bb, key: i + 1 };
    });
    setOptions([...tempData]);
  };

  const handleSKUData = async (data) => {
    console.log(data);
    let initialData = data ? data : Options;

    console.log(initialData, "step 1");
    let tempData = initialData
      .map((aa) => aa.values)
      .filter((bb) => bb !== null && bb.length > 0);
    // return null;
    const cartesian = (...a) =>
      a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
    let output = cartesian(...tempData);
    console.log(output, "output");

    const dataSource = output.map((data) => {
      return { variants: data, price: null, qty: null, sku: null };
    });
    setDataSource(dataSource);
    console.log(dataSource);
  };

  const handleOptionNameInput = (val, op) => {
    const index = Options.findIndex((aa) => aa.key === op.key);
    let tempData = Options;
    tempData[index].optionName = val;

    console.log(tempData);
    setOptions(val ? [...tempData] : Options);
  };

  const handleOptionMultiSelectInput = (ms, op) => {
    const index = Options.findIndex((aa) => aa.key === op.key);
    let tempData = Options;
    tempData[index].values = ms;
    let data = [...tempData];
    console.log(data, "0");
    handleSKUData(data);
    setOptions(ms ? [...tempData] : Options);
  };

  const OptionType = [
    { name: "Size", value: "size" },
    { name: "Color", value: "color" },
    { name: "Material", value: "material" },
    { name: "Style", value: "style" },
  ];

  return (
    <div className="p-4">
      {/* -------------------------------------------------------------Initial Screen------------------------------------------------------------------- */}
      <div>
        <Checkbox
          onChange={(e) => {
            setAllowVariants(e.target.checked);
          }}
        >
          This product has multiple options, like different sizes or colors
        </Checkbox>
      </div>
      <div className="py-2">
        <Button
          disabled={!allowVariants}
          className="w-full"
          type="primary"
          onClick={showModal}
        >
          Add Variants
        </Button>
      </div>

      {/* 2 ---------------------------------------------------------Modal For variation Add here----------------------------------------------------------------- */}
      <Modal
        visible={addVariants}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        wrapClassName="p-0"
        bodyStyle={{ padding: 0 }}
        closable="false"
        className="w-full"
      >
        <div className="p-4 py-2 ">
          <h1 className="text-lg text-primary-color font-semibold">Options</h1>
        </div>
        <Divider className="mt-1 mb-0" />
        {/* 3 -------------------------------------------------------User ADD Variations------------------------------------------------------- */}
        <div className="p-4 pt-0">
          {Options &&
            Options.map((op) => {
              const SelectedOption = Options.filter(
                (so) => !_.includes([null, "", undefined], so.optionName)
              )
                .map((aa) => aa.optionName)
                .filter((aa) => aa !== op.optionName);
              return (
                <OptionInputs
                  OptionType={OptionType.filter(
                    (aa) => !_.includes(SelectedOption, aa.value)
                  )}
                  showRemove={Options.length > 1}
                  key={op.key}
                  handleRemoveClick={() => {
                    handleRemoveClick(op);
                  }}
                  options={{
                    OptionNumber: op.key,
                    OptionPlaceholder: "Select Variant",
                    OptionDefaultValue: op.optionName,
                    OptionValue: op.optionName,
                    handleOptionNameInput: (val) => {
                      handleOptionNameInput(val, op);
                    },
                  }}
                  multiSelect={{
                    multiSelectPlaceholder: "Please Enter Variants",
                    multiSelectDefaultValue: op.values,
                    multiSelectValue: op.values,
                    handleOptionMultiSelectInput: (ms) => {
                      handleOptionMultiSelectInput(ms, op);
                    },
                  }}
                />
              );
            })}
        </div>
        <Divider className="mt-0 mb-0" />
        <div className="p-4">
          <Button
            className="w-full"
            type="primary"
            onClick={() => {
              setOptions([
                ...Options,
                { optionName: null, values: null, key: Options.length + 1 },
              ]);
            }}
            disabled={Options.length === OptionType.length}
          >
            Add Another Options
          </Button>
        </div>
        <Divider className="mt-0 mb-0" />
        {/* 4 -------------------------------------------------------User Preview Variations------------------------------------------------------- */}
        <Table
          className="px-4 py-3"
          bordered={true}
          dataSource={dataSource}
          size={"small"}
          columns={[
            {
              width: 160,
              title: "Variants",
              dataIndex: "variants",
              key: "Variant",
              render: (data) => {
                return data.map((aa, i) => (i !== 0 ? `/ ${aa}` : `${aa} `));
              },
            },
            {
              title: "Price",
              dataIndex: "price",
            },
            {
              title: "Quantity",
              dataIndex: "qty",
            },
            {
              title: "SKU",
              dataIndex: "sku",
            },
          ]}
        />
        <Divider className="mt-1 mb-0" />
        <div className="flex justify-end p-4">
          <Button className="mr-1">Back</Button>
          <Button type="primary" onClick={() => handleSKUData()}>
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;

// --------------------------- initially made component---------------
// return (
//   <div className="pt-1">
//     <div className="leading-loose flex justify-between">
//       <div className="font-semibold">Option {op.key || "1"}</div>
//       {Options.length > 1 && (
//         <div
//           className="font-normal text-primary-color underline cursor-pointer"
//           onClick={handleRemoveClick}
//         >
//           Remove
//         </div>
//       )}
//     </div>
//     <div className="grid grid-cols-3 gap-4">
//       <div className="">
//         <Select
//           placeholder={"Select Variant"}
//           defaultValue={op.optionName}
//           value={op.optionName}
//           onChange={(value, option) => {
//             handleOptionNameInput(value, op);
//           }}
//           className="w-full"
//         >
//           {OptionType.map((val) => {
//             return (
//               <Option key={val.value} value={val.value}>
//                 {val.name}
//               </Option>
//             );
//           })}
//         </Select>
//       </div>
//       <div className="w-full col-span-2">
//         <Select
//           mode="tags"
//           placeholder={"Please Enter Variants"}
//           defaultValue={op.values}
//           value={op.values}
//           onChange={(value, option) => {
//             handleOptionMultiSelectInput(value, op);
//           }}
//           onInputKeyDown={(e) => {
//             if (e.code === "Tab") {
//             }
//           }}
//           optionFilterProp="label"
//           className="w-full"
//         ></Select>
//       </div>
//     </div>
//   </div>
// );
