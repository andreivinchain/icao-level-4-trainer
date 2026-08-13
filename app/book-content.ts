const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type BookUnitContent = {
  image: string;
  alt: string;
  pictureQuestions: string[];
  sampleAnswer: string;
  gistSummary: string;
};

type BookUnitText = Omit<BookUnitContent, "image">;

const unitText: BookUnitText[] = [
  {
    alt: "Two twin-engine aircraft flying dangerously close together above cloud",
    pictureQuestions: [
      "Which aircraft is nearer the ground?",
      "Where was the photographer in relation to the aircraft?",
      "Are there any markings on the aircraft?",
      "What do you think will happen next?",
      "Why do you think this situation occurred?",
    ],
    sampleAnswer: "This picture shows two twin-engine aircraft heading in the same direction but flying dangerously close together. The lower aircraft is smaller and is veering left at an angle of about twenty degrees. Its tail is partly obscured, and the markings are difficult to identify. They may have been flying in formation, or this could be a near collision in dense cloud.",
    gistSummary: "Poor communication and conflicting instructions created a serious near-miss risk, so both aircraft had to alter course.",
  },
  {
    alt: "Two vintage biplanes crossing in formation with display smoke",
    pictureQuestions: [
      "What are the aircraft doing?",
      "What do you think are the speed and altitude of the aircraft?",
      "Why are there smoke trails coming from the aircraft?",
      "What do you think will happen next?",
      "Who do you think took the photograph?",
    ],
    sampleAnswer: "Two vintage Boeing Stearman biplanes are crossing in formation at an angle of roughly forty degrees. The aircraft in the foreground is slightly lower. Both are producing display smoke and have matching sunburst markings, so they are probably part of an aerobatic display team. The weather is fine with light cloud and blue patches.",
    gistSummary: "Air-show traffic requires unusual sequencing because VFR aircraft, display formations and IFR arrivals operate at very different speeds.",
  },
  {
    alt: "A Gulf airliner prepared for a VIP beside a red carpet",
    pictureQuestions: [
      "What kind of person is the flight for?",
      "Why are there so many people by the aircraft?",
      "Where are the people standing in relation to the aircraft?",
      "How long after the landing do you think the photo was taken? Why?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A Gulf airliner is waiting on the dispersal for VIP passengers. The air-stair door is open and a long red carpet has been laid out. A cleaner is preparing the carpet, officials are waiting near the aircraft and the APU is connected. The humid, hazy background and palm decoration suggest an airport in the Gulf.",
    gistSummary: "A short-notice VIP movement delays normal traffic and may force an aircraft with limited fuel to hold or divert.",
  },
  {
    alt: "Three commercial aircraft in a close landing sequence at sunset",
    pictureQuestions: [
      "What time of day is it?",
      "What sort of airfield are the aircraft flying into?",
      "How far do you think they are from the runway?",
      "What heading do you think the aircraft are flying?",
      "What do pilots typically do at this phase of flight?",
    ],
    sampleAnswer: "Three commercial aircraft are in a tight sequence on an instrument approach at sunset. The first two have their landing gear and lights down, while the highest aircraft has not yet adopted the landing configuration. They appear to be on final at a busy international airport using radar and segregated runways.",
    gistSummary: "Operational delays can be caused by a disabled runway, sector saturation, a ramp spillage, snow removal or weather below minima.",
  },
  {
    alt: "A Swiss turboprop stopped after a belly landing",
    pictureQuestions: [
      "Where is the man in relation to the aircraft?",
      "Where do you think this incident occurred?",
      "What markings are there on the aircraft?",
      "What do you think caused the accident?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A medium-sized Swiss turboprop has stopped near the end of a runway after an apparent gear problem or wheels-up landing. An engineer is standing near the wing root assessing the damage. The propeller blades do not look badly bent, so the engines may have been stopped before touchdown. The aircraft will need to be lifted and towed to a hangar.",
    gistSummary: "An unsafe landing-gear indication leads to a low pass, a visual check and preparations for an abnormal landing.",
  },
  {
    alt: "A turboprop beginning take-off with a flock of birds on the runway",
    pictureQuestions: [
      "What do you think the pilots are doing?",
      "Why are the birds moving?",
      "What sort of airfield do you think it is?",
      "Where was the photograph taken from?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A high-wing turboprop is starting its take-off roll with both engines running and its landing lights on. A flock of white birds is directly ahead on the runway and many are beginning to take off because the aircraft has frightened them. The birds create an immediate strike hazard for the crew.",
    gistSummary: "A bird strike can damage the aircraft, leave an unsafe indication and create steering problems during the landing.",
  },
  {
    alt: "Three cargo aircraft and freight containers at a busy terminal",
    pictureQuestions: [
      "Is the cargo incoming or outbound?",
      "Where do you think the picture was taken?",
      "What items do you think are contained in the shipments?",
      "What is the JAL van in the middle of the picture doing?",
      "How is the cargo loaded onto or unloaded from the planes?",
    ],
    sampleAnswer: "Three Boeing 747 cargo aircraft are lined up at a busy freight terminal. The foreground is covered with containers and pallets, and several service vehicles are moving between the aircraft and terminal. The aircraft appear to belong to JAL, Cathay Pacific and Polar Air Cargo.",
    gistSummary: "A cargo-panel warning requires the crew, dispatch and engineers to confirm whether the panel is closed before continuing.",
  },
  {
    alt: "Firefighters attacking a large fire on an aircraft training mock-up",
    pictureQuestions: [
      "Where is this activity taking place?",
      "How many people do you think are involved?",
      "How long do you think the activity will last?",
      "How does this sort of activity affect operations?",
      "How often do you think this training happens?",
    ],
    sampleAnswer: "This is an airport fire-training exercise using a mock-up aircraft. The starboard engine and part of the wing are engulfed in flames and producing thick black smoke. Two large fire appliances and several firefighters are attacking the fire with roof-mounted monitors, water or foam.",
    gistSummary: "A cabin fire requires a Mayday call, rapid landing, fire services and a clear plan for stopping and evacuation.",
  },
  {
    alt: "An airliner following a vehicle during ground movement",
    pictureQuestions: [
      "Where is the aircraft?",
      "Where was the photographer in relation to the aircraft?",
      "Why is the aircraft following the car?",
      "Are there any markings on the aircraft?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "The aircraft is taxiing on an apron and appears to be following a follow-me vehicle. The vehicle is guiding the crew through an unfamiliar or restricted part of the airport. The photographer is in front of the aircraft, probably inside another vehicle or behind a protected area.",
    gistSummary: "Confusion about stands and taxi guidance can lead to a wrong turn, an obstacle strike or an aircraft leaving the paved surface.",
  },
  {
    alt: "Medical staff moving a patient between an aircraft and ambulance",
    pictureQuestions: [
      "What type of aircraft is it?",
      "What type of flight do you think it is? Why?",
      "What sort of airfield do they land at?",
      "Why do you think this situation occurred?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A patient is being moved on a stretcher between an aircraft and an ambulance. Several medical staff are wearing protective suits, masks and gloves, suggesting a contagious illness or medical evacuation. The wing of a turboprop and part of a rear-engined jet are visible around the ambulance.",
    gistSummary: "When a pilot becomes incapacitated, the remaining pilot must declare the problem, divert and arrange immediate medical assistance.",
  },
  {
    alt: "A broken aircraft fuselage partly submerged after ditching",
    pictureQuestions: [
      "Where is the plane?",
      "What do you think happened?",
      "How long after the landing do you think the photo was taken? Why?",
      "Where was the photographer in relation to the aircraft?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "An American-registered aircraft is partly submerged in water after a ditching. Only the tail and upper fuselage remain visible, and the fuselage has split through the registration markings. The cloudy sky, palm trees and dense vegetation suggest a warm coastal or wetland area.",
    gistSummary: "After losing power, the crew must choose a ditching area, report persons on board and coordinate rescue assets.",
  },
  {
    alt: "A small aircraft on a remote grass strip beside an elephant",
    pictureQuestions: [
      "Why do you think the aircraft has landed here?",
      "What danger does the elephant pose to the aircraft, crew and passengers?",
      "What other wildlife could be present here?",
      "Where was the photographer in relation to the elephant and the aircraft?",
      "Do you think there are any airfield facilities here? Why or why not?",
    ],
    sampleAnswer: "A small high-wing aircraft has landed on a remote grass strip. A large elephant is walking only about fifty metres from the aircraft, and there are no visible buildings, fences or airport facilities. Wildlife can roam freely across the operating area, creating a serious hazard.",
    gistSummary: "Animals near the runway can force a rejected take-off, delay an arrival and require airport staff to clear the operating area.",
  },
  {
    alt: "An airliner landing with one wing very low and tyre smoke",
    pictureQuestions: [
      "What is happening in the picture?",
      "What are the markings on the plane?",
      "What is the flap configuration?",
      "Where was the photograph taken from?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A Swiss airliner is making an unconventional and unstable landing with its right wing very low. The right main wheel has touched down and is producing smoke, while the nose wheel is still in the air. The pilot may continue the landing or apply power and go around.",
    gistSummary: "Wake turbulence, windshear and unstable wind conditions can require avoiding action, a go-around or delaying vectors.",
  },
  {
    alt: "An aircraft being de-iced on a snowy apron",
    pictureQuestions: [
      "Why is the aircraft being de-iced?",
      "Where do you think the picture was taken?",
      "What difficulties might the crew face when manoeuvring? Why?",
      "How long will the procedure take?",
      "Where on the airfield is this activity taking place?",
    ],
    sampleAnswer: "An Airbus is being prepared for departure in snowy, mountainous conditions. A special truck is spraying de-icing fluid over the wings to remove frozen contamination. After the ice has melted, an anti-icing coating will protect the lifting surfaces before take-off.",
    gistSummary: "Severe icing can reduce performance, freeze instruments and force the crew to change altitude or route immediately.",
  },
  {
    alt: "An airliner approaching through lightning and convective weather",
    pictureQuestions: [
      "Where do you think the picture was taken?",
      "What time of year is it?",
      "What phase of flight do you think the aircraft is in?",
      "What difficulties might the flight crew be experiencing?",
      "What will happen next?",
    ],
    sampleAnswer: "An aircraft appears to be approaching for landing during a dark convective storm. Its gear and landing lights are visible, while fork lightning, dense cloud, updrafts and possible crosswinds surround the flight path. The crew will need to avoid the worst cells and maintain careful directional control.",
    gistSummary: "Lightning, turbulence, windshear and cumulonimbus cells may require an immediate climb, diversion or weather-avoidance heading.",
  },
  {
    alt: "A damaged airliner with a large section of upper fuselage missing",
    pictureQuestions: [
      "How do you think the damage occurred?",
      "What would be the effect of the damage on the handling of the plane?",
      "What could the pilot have done to land the damaged plane successfully?",
      "Where do you think the picture was taken?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A Boeing 737 is on the ground after a major structural failure. A large part of the upper fuselage has blown away, probably following rapid depressurization rather than sabotage. The crew managed to land, but anyone seated near the damaged section may have suffered serious injuries.",
    gistSummary: "Rapid depressurization requires an emergency descent, clear communication and immediate help for passengers after landing.",
  },
  {
    alt: "Three drawings showing an unruly passenger attacking a pilot and being restrained",
    pictureQuestions: [
      "Why did the passenger attack the pilot?",
      "How did the other passengers feel?",
      "What will the flight crew do now?",
      "What will the cabin crew do now?",
      "How will the man be punished?",
    ],
    sampleAnswer: "The sequence shows an aggressive passenger moving down the aisle, attacking the captain in the cockpit and then being restrained on the cabin floor. Crew members and passengers look frightened but eventually bring the situation under control. The aircraft will probably divert and police will meet it after landing.",
    gistSummary: "An unruly passenger is restrained, the cockpit is secured and the crew diverts while coordinating police and company assistance.",
  },
  {
    alt: "A bomb-disposal robot and an expert in a protective suit at an airport gate",
    pictureQuestions: [
      "Describe the position of the people and equipment in each picture.",
      "What are the similarities between the two pictures?",
      "What are the differences between the two pictures?",
      "Do you think the pictures are connected to the same incident? Why or why not?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "Both pictures show an evacuated departure lounge. A remotely controlled tracked robot with a gripping arm is examining a suspicious package in one image. In the other, a bomb-disposal expert wearing a protective suit and helmet is leaving the same area. The incident is probably being investigated before the terminal reopens.",
    gistSummary: "A suspicious device or hijack threat leads to evacuation, security action and coordination between the crew, ATC and police.",
  },
  {
    alt: "An Airbus rotating with its tail extremely close to the runway",
    pictureQuestions: [
      "Do you think the aircraft is landing or taking off? Why?",
      "Why do you think the tail is so close to the surface?",
      "What do you think will happen next?",
      "What sort of flight do you think it is?",
      "Who do you think took the photograph?",
    ],
    sampleAnswer: "An Airbus A340 has just become airborne with an unusually high nose-up attitude. The tail is extremely close to the runway, suggesting early rotation, over-rotation or a flapless test take-off. The aircraft may suffer a tail strike and need to return for inspection.",
    gistSummary: "A tail strike, runway debris or fuel leak during take-off can force a rejected departure, go-around or return for inspection.",
  },
  {
    alt: "A maritime patrol aircraft flying low past a ship and rescue boats",
    pictureQuestions: [
      "Where do you think the photo was taken?",
      "What do you think is happening?",
      "Which way is the wind blowing?",
      "Where was the photographer in relation to the aircraft?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A maritime patrol aircraft is making a low left turn over a naval support ship and several rescue boats. The calm sea and anchored ship suggest a display or exercise near the coast. A lifeboat crew in the foreground is moving quickly towards the ship.",
    gistSummary: "A lost aircraft with unreliable navigation may declare minimum fuel and require radar vectors or a no-gyro approach.",
  },
  {
    alt: "Engineers inspecting an open engine nacelle in a hangar",
    pictureQuestions: [
      "What systems could the engineers be checking?",
      "How long do you think the maintenance will take?",
      "How do you think the engineer climbed inside the nacelle?",
      "Why was the picture taken?",
      "Where was the photograph taken from?",
    ],
    sampleAnswer: "A four-engine jet is undergoing maintenance in a clean hangar. The number-three engine cowling is open and an engineer is inspecting the fan blades with a bright light. A nearby computer may be connected for diagnostic tests, while fibre-optic equipment could be used to inspect internal turbine components.",
    gistSummary: "A mechanical breakdown can close a runway and require inspection, towing, disembarkation or on-site maintenance.",
  },
  {
    alt: "An engineer adjusting avionics inside an aircraft cockpit",
    pictureQuestions: [
      "What type of aircraft is it?",
      "Where was the photographer in relation to the engineer?",
      "What is the engineer adjusting?",
      "Why do you think this equipment needs adjusting?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "An engineer is carrying out delicate work on a bank of avionics inside an aircraft. He is looking upward through his glasses and holding a tool or connector near the instruments. A small test device is resting on a tray, and his other tools are probably stored on the trolley behind him.",
    gistSummary: "An electrical failure may remove lighting, instruments or transponder capability and require backup power or a diversion.",
  },
  {
    alt: "A volcano producing a large plume of ash",
    pictureQuestions: [
      "Which region of the world do you think the picture was taken in? Why?",
      "At what time of day was the picture taken?",
      "Who took the picture?",
      "What effect would this have on flight operations?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A conical volcano is erupting and producing a huge plume of thick ash several thousand feet high. Steam is rising from the crater rim and the lower slopes are covered with trees. The picture may have been taken from an aircraft, and the ash cloud presents a serious hazard that will trigger warnings and route restrictions.",
    gistSummary: "A volcanic-ash encounter reduces visibility and engine safety, so crews must report its position and avoid the cloud.",
  },
  {
    alt: "Airport sign showing dangerous goods forbidden on aircraft",
    pictureQuestions: [
      "Why are these items forbidden?",
      "Where would you find a sign like this?",
      "Why does the sign use pictures?",
      "What equipment and procedures are used to check passengers and crew?",
      "What happens to passengers who try to carry these items on board?",
    ],
    sampleAnswer: "The sign shows dangerous items that passengers must not carry in hold or hand luggage. The symbols include acid, poison, flammable liquids, fireworks, matches, bleach, gas and a fire extinguisher. Pictograms are used so travellers can understand the warning regardless of language.",
    gistSummary: "Fumes from dangerous goods can injure passengers and force an immediate landing and evacuation.",
  },
  {
    alt: "Two airliners damaged in a collision on an airport stand",
    pictureQuestions: [
      "Why do you think this incident happened?",
      "How long after the collision do you think the picture was taken?",
      "Where was the photographer in relation to the aircraft?",
      "How long do you think it will take to rectify the situation?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "An Airbus and an MD-80 appear to have collided near an airport stand. The smaller aircraft is lodged beneath the larger one, and the Airbus wing and empennage have damaged the MD-80 fuselage. Fire crews and ground staff are assessing the scene under bright floodlights.",
    gistSummary: "A ground collision requires both aircraft to stop, report damage, protect passengers and arrange a detailed inspection.",
  },
  {
    alt: "An aircraft being refuelled by a ground vehicle",
    pictureQuestions: [
      "Where is the fuel stored?",
      "What do you think the pilots are doing while the aircraft is being refuelled?",
      "Where are the fuel tanks on this aircraft?",
      "Where do you think the picture was taken?",
      "What do you think will happen next?",
    ],
    sampleAnswer: "A Boeing airliner is being refuelled on the apron from underground tanks through a service vehicle. A ground handler in high-visibility clothing is connecting or disconnecting the hose beneath the wing. The wooded hillside and grey weather suggest a European airport.",
    gistSummary: "A fuel leak or imbalance may require a return, fuel dumping, flap restrictions and vectors until the aircraft is ready to land.",
  },
  {
    alt: "Hundreds of demonstrators forming the word NO near an airfield",
    pictureQuestions: [
      "What are the people demonstrating about?",
      "Who will see the sign?",
      "At what time of day was the picture taken?",
      "How long do you think the demonstrators stood in position?",
      "Where was the photograph taken from?",
    ],
    sampleAnswer: "Several hundred demonstrators are standing on a playing field in a formation spelling the word NO. They appear to be holding orange placards. Residential streets, industrial buildings and an airfield with parked aircraft are visible beyond the field, so the message is probably intended to be seen from the air.",
    gistSummary: "Balloons, vehicles, construction work or protesters near the manoeuvring area can restrict operations and require holding.",
  },
  {
    alt: "A twin-engine aircraft at the end of a confined mountain airstrip",
    pictureQuestions: [
      "Which region of the world is this airfield in?",
      "What difficulties would a pilot face on landing and taking off?",
      "What condition is the runway in?",
      "What would happen if a pilot misjudged the approach?",
      "Why are there no signs of activity?",
    ],
    sampleAnswer: "A twin-engine aircraft is stopped at the end of a narrow untarmacked strip in a mountain valley. Houses and chalets are close to the runway, and a snow-capped mountain dominates the background. The approach and overshoot appear possible in only one direction, leaving little margin for error.",
    gistSummary: "A confined airfield with crossing vehicles, terrain and helicopter traffic demands precise position reports and separation.",
  },
  {
    alt: "An airport control tower blackened by fire damage",
    pictureQuestions: [
      "What could cause a fire like this?",
      "What effect would it have on airport operations?",
      "When do you think the picture was taken?",
      "How long will it take to repair the damage?",
      "How will the airport operator manage while the tower is unserviceable?",
    ],
    sampleAnswer: "An airport control tower has suffered a serious external fire. The flames are out, but the area below several observation windows is blackened and damaged. Firefighters remain on the roof, and the facility has probably been evacuated, leaving the airport unable to provide normal control services.",
    gistSummary: "Radar, lighting or navigation-equipment failure can produce erroneous information and force crews to use raw data or suspend operations.",
  },
  {
    alt: "A badly damaged airport passenger vehicle overturned on its side",
    pictureQuestions: [
      "Why do you think this happened?",
      "What equipment will be needed to clear the area?",
      "How long will it take to clear the area?",
      "What effect will the incident have on airport operations?",
      "Who will be involved in the investigation?",
    ],
    sampleAnswer: "A large airport passenger vehicle has overturned and is badly damaged. Its windscreen is missing, the front axle appears bent and debris is scattered across the ground. Air stairs behind the vehicle indicate that the accident occurred on an apron and may have involved an aircraft or another service vehicle.",
    gistSummary: "A ground-service collision or runway incursion requires engines to be stopped, emergency vehicles dispatched and the area inspected.",
  },
];

export function getBookUnitContent(unitNumber: string): BookUnitContent {
  const index = Math.max(0, Math.min(unitText.length - 1, Number(unitNumber) - 1));
  return {
    ...unitText[index],
    image: `${basePath}/book/unit-${String(index + 1).padStart(2, "0")}.webp`,
  };
}

export function getBookTestImage(testIndex: number): string {
  return `${basePath}/book/test-${String(testIndex + 1).padStart(2, "0")}.webp`;
}
