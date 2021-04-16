import React from "react";
import { Text, Flex } from "@chakra-ui/react";

const Participants = ({ participants }) => {
  return (
    <Flex h="80%" flexDirection="column">
      {participants.map((participant, i) => (
        <>
          <Flex w="100%" justify="space-between">
            <Text key={i} fontWeight="bold" mt="4" mx="4" color="gray.600">
              {participant.name.length > 30 ? participant.name.substring(0, 27) + "..." : participant.name}
            </Text>
          </Flex>
        </>
      ))}
    </Flex>
  );
};

export default Participants;
