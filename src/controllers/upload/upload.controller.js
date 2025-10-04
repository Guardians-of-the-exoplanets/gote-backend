import { exoplanetClassifier } from "../../services/upload/upload.service.js";

export class UploadController{
    static exoplanetClassifier(req, res){
        const {mode, dataset} = req.body;
        const base64 = req.zipBase64;

        console.log("req", req.body);
        console.log("base64", base64);

        if (
            !mode &&
            !dataset &&
            !base64
        ){
            res.status(400).json({ error: "Missing required fields" });
        }

        exoplanetClassifier("predict_upload", dataset, base64).then((response) => {
          if (response) {
            res.status(200).send({ data: response });
          } else {
            res.status(404).send({ error: 'No data received' });
          }
        }).catch((err) => {
          res.status(500).send({ error: err });
        });
        
    }
}