import React from "react";
import { Button, Flex } from "@chakra-ui/react";

const Participants = ({ participants }) => {
  return (
    <Flex h="80%" flexDirection="column" w="100%">
      {participants.map((participant, i) => (
        <>
          <Flex w="100%" justify="space-between">
            <Button key={i} fontWeight="bold" mt="2" mx="4" border="1px" borderColor="gray.600" color="gray.600" w="100%">
              {participant.name.length > 30 ? participant.name.substring(0, 27) + "..." : participant.name}
            </Button>
          </Flex>
        </>
      ))}
    </Flex>
  );
};

export default Participants;
