import "./styles.css";
import Box from "./Box";

export default function App() {
  return (
    <div className="App">
      <Box
        horizontalDots={8}
        verticalDots={8}
        className="box"
        onSelectionsChange={(res) => {
          console.log(res);
        }}
      />
    </div>
  );
}
