import {onRequest} from "firebase-functions/v2/https";
import {baseURL, endPoints} from "./utils/api-handler";

export const clientCredentials = onRequest(async (request, res: any) => {
  fetch(baseURL + endPoints.token + "?grant_type=client_credentials", {
    method: "post",
    headers: {
      ContentType: "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(
        process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
      )}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.log("response.status", response.status);
        console.log("response.statusText", response.statusText);
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((data: any) => res.send(data))
    .catch((error) => {
      console.log("error", error);
      return res.send({
        type: "ERROR",
        message: error.message,
      });
    });
});

export const employees = onRequest(async (request, res: any) => {
  const token = request.query.token;

  await fetch(
    baseURL + endPoints.employees + "?shop=6212&sortDirection=ASC&size=10",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        console.log("response.status", response.status);
        console.log("response.statusText", response.statusText);
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((data: any) => res.send(data))
    .catch((error) => {
      console.log("error", error);
      return res.send({
        type: "ERROR",
        message: error.message,
      });
    });
});

export const repairOrder = onRequest((request, res: any) => {
  const repairOrderId = request.query.repair_order_id;
  const token = request.query.token;

  fetch(
    baseURL +
    endPoints.repairOrders +
    "?repairOrderNumber=" +
    repairOrderId +
    "&shop=6212",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        console.log("response.status", response.status);
        console.log("response.statusText", response.statusText);
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((data: any) => res.send(data))
    .catch((error) => {
      console.log("error", error);
      return res.send({
        type: "ERROR",
        message: error.message,
      });
    });
});

export const updateJob = onRequest(async (request, res: any) => {
  const jobId = request.query.job_id;
  const technicianId = request.query.technician_id;
  const completed = request.query.completed;
  const token = request.query.token;

  console.log("jobId", jobId);
  console.log("technicianId", technicianId);
  console.log("completed", completed);
  console.log("token", token);


  fetch("https://shop.tekmetric.com/api/v1/jobs/" + jobId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({
      technicianId: technicianId,
      completed: completed,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log("response.status", response.status);
        console.log("response.statusText", response.statusText);
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log("error", error);
      return res.send({
        type: "ERROR",
        message: error.message,
      });
    });
});
export const updateRepairOrder = onRequest(async (request, res: any) => {
  const repairOrderId = request.query.repair_order_id;
  const milesOut = request.query.miles_out;
  const milesIn = request.query.miles_in;
  const token = request.query.token;

  console.log("repairOrderId", repairOrderId);
  console.log("milesOut", milesOut);
  console.log("token", token);


  fetch("https://shop.tekmetric.com/api/v1/repair-orders/" + repairOrderId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({
      milesOut: parseInt(milesOut as string),
      milesIn: parseInt(milesIn as string),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log("response.status", response.status);
        console.log("response.statusText", response.statusText);
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log("error", error);
      return res.send({
        type: "ERROR",
        message: error.message,
      });
    });
});
