import {
  Flex,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { injected } from "../../../config/web3";
import { useCallback, useEffect, useState } from "react";

const WalletData = () => {
  const [balance, setBalance] = useState(0);
  const { active, account, library, deactivate, activate, error } = useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const connect = useCallback(() => {
    activate(injected);
    localStorage.setItem('previouslyConnected', 'true');
  }, [activate]);

  const disconnect = () => {
    deactivate();
    localStorage.removeItem('previouslyConnected');
  }
  const getBalance = useCallback(async () => {
    const accountBalance = await library.eth.getBalance(account);
    setBalance((accountBalance / 1e18).toFixed(2));
  }, [library?.eth, account]);
  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance]);

  useEffect(() => {
    const wasPreviouslyConnected = localStorage.getItem('previouslyConnected');

    if (wasPreviouslyConnected === 'true') connect();
  }, [connect]);

  return (
    <Flex alignItems={"center"}>
      {active ? (
        <Tag colorScheme="green" borderRadius="full">
          <TagLabel>
            <Link to={`/punks?address=${account}`}>{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</Link>
          </TagLabel>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
            ~{balance} Ξ
          </Badge>
          <TagCloseButton onClick={disconnect} />
        </Tag>
      ) : (
        <Button
          variant={"solid"}
          colorScheme={"green"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsupportedChain}
        >
          {isUnsupportedChain ? "Red no soportada" : "Conectar wallet"}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;