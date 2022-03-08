import { Fragment } from "react";
import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

const DUMMY_MEETUP = {
  id: "m1",
  title: "First Meetup",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
  address: "Some address 5, 12345 Some City",
  description: "This is a first meetup",
};

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail {...props.meetupData} />
    </Fragment>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  //github.com/caesarLeeTW/nextjs-course-demo

  https: return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  selectedMeetup.id = selectedMeetup._id.toString();
  delete selectedMeetup._id;
  // fetch data from an API
  return {
    props: {
      meetupData: selectedMeetup,
    },
  };
};

export default MeetupDetails;
