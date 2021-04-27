import React from 'react';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';

const Participants = React.memo(
  ({ participants, handlePromotion, handleDemotion }) => {
    return (
      <Flex h="80%" flexDirection="column" w="90%" mx="4">
        {participants.map((participant, i) => (
          <>
            <Flex justify="space-between">
              <Box fontWeight="bold">
                {(participant.name.length > 30
                  ? participant.name.substring(0, 27) + '...'
                  : participant.name) + (i === 0 ? ' (You)' : '')}
              </Box>
              {participants[0].role === 'teacher' ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<BsThreeDotsVertical />}
                    color="blue.400"
                  ></MenuButton>
                  <MenuList>
                    {participant.role === 'student' ? (
                      <MenuItem onClick={() => handlePromotion(participant)}>
                        Promote
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={() => handleDemotion(participant)}>
                        Demote
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              ) : null}
            </Flex>
          </>
        ))}
      </Flex>
    );
  }
);

export default Participants;
