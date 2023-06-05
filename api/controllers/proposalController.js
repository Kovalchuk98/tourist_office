import { compare } from "bcrypt";
import Proposal from "../models/proposal.model.js";
import moment from "moment";
import "moment/locale/ru.js";
moment.locale("ru");

class proposalController {
  async addProposal(req, res) {
    try {
      const {
        name,
        descr,
        ename,
        ephone,
        img,
        file,
        cimg,
        cname,
        cdescr,
        date,
        coords,
      } = req.body;

      const employee = {
        name: ename,
        phone: ephone,
      };

      const marker = {
        name: cname,
        descr: cdescr,
        img: cimg,
        location: JSON.parse(coords),
      };

      const candidate = await Proposal.findOne({ name });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Entry with the same name already exists" });
      }
      const proposal = new Proposal({
        name,
        descr,
        date: JSON.parse(date),
        employee,
        img,
        file,
        marker,
      });
      await proposal.save();
      return res.json({ message: "Proposal was created" });
    } catch (e) {
      res.status(400).json({ message: "Create error" });
    }
  }

  async updateProposal(req, res) {
    try {
      console.log(req.body.img);
      await Proposal.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          descr: req.body.descr,
          date: JSON.parse(req.body.date),

          employee: {
            name: req.body.ename,
            phone: req.body.ephone,
          },
          img: req.body.img,
          file: req.body.file,
          marker: {
            name: req.body.cname,
            descr: req.body.cdescr,
            img: req.body.cimg,
            location: JSON.parse(req.body.coords),
          },
        }
      );
      res.json({ message: "Updated" });
    } catch (e) {
      res.status(400).json({ message: "Update data error" });
    }
  }

  async updatePreview(req, res) {
    try {
      await Proposal.updateOne(
        { _id: req.params.id },
        {
          img: req.body.img,
        }
      );
      res.json({ message: "Updated" });
    } catch (e) {
      res.status(400).json({ message: "Update data error" });
    }
  }

  async getProposalsForWeek(req, res) {
    try {
      const start = req.query.start.split(".").reverse().join("-");
      const end = req.query.end.split(".").reverse().join("-");

      const proposals = await Proposal.find({
        date: {
          $elemMatch: {
            $gte: new Date(start),
            $lte: new Date(end),
          },
        },
      });

      res.json(proposals);
    } catch (e) {
      res.status(400).json({ message: "Fetch data error" });
    }
  }

  async deleteMarker(req, res) {
    try {
      await Proposal.updateOne(
        { _id: req.params.id },
        {
          $unset: {
            marker: {
              name: "",
              descr: "",
              img: "",
              location: [],
            },
          },
        }
      );
      res.sataus(200).json({ message: "Marker was deleted" });
    } catch (e) {
      res.status(400).json({ message: "Delete data error" });
    }
  }

  async deleteProposal(req, res) {
    try {
      await Proposal.deleteOne({ _id: req.params.id });
      res.json({ message: "Deleted" });
    } catch (e) {
      res.status(400).json({ message: "Delete data error" });
    }
  }
}

export default new proposalController();
